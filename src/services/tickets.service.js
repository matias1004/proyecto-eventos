import * as ticketsRepository from "../repositories/tickets.repository.js";
import * as eventsRepository from "../repositories/events.repository.js";
import { generateReservationCode } from "../utils/reservationCode.js";
import { sendTicketConfirmation } from "../utils/mailer.js";

const httpError = (message, status) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

export const createTicket = async (eventId, data, user) => {
  const event = await eventsRepository.getById(eventId);
  if (!event) throw httpError("Evento no encontrado", 404);

  if (event.status !== "published") {
    throw httpError("Solo se puede inscribir a eventos publicados", 400);
  }

  const existing = await ticketsRepository.hasActiveTicket(user._id, event._id);
  if (existing) {
    throw httpError("Ya tenés una inscripción activa a este evento", 409);
  }

  const quantity = Number(data.quantity) || 1;
  if (quantity < 1) throw httpError("La cantidad debe ser mayor a 0", 400);

  const used = await ticketsRepository.getActiveQuantity(event._id);
  const available = event.capacity - used;

  if (quantity > available) {
    throw httpError(`No hay cupo suficiente. Lugares disponibles: ${available}`, 409);
  }

  const ticket = await ticketsRepository.create({
    user: user._id,
    event: event._id,
    quantity,
    reservationCode: generateReservationCode(),
  });

  sendTicketConfirmation(user.email, ticket, event).catch((error) => {
    console.error("No se pudo enviar el mail de confirmación:", error.message);
  });

  return ticket;
};

export const getMyTickets = (userId) => ticketsRepository.getByUser(userId);

export const getEventTickets = async (eventId, user) => {
  const event = await eventsRepository.getById(eventId);
  if (!event) throw httpError("Evento no encontrado", 404);

  const isOwner = event.organizer.toString() === user._id.toString();
  const isAdmin = user.role === "admin";
  if (!isOwner && !isAdmin) {
    throw httpError("No tenés permisos para ver las inscripciones de este evento", 403);
  }

  return ticketsRepository.getByEvent(event._id);
};

export const cancelTicket = async (ticketId, user) => {
  const ticket = await ticketsRepository.getById(ticketId);
  if (!ticket) throw httpError("Ticket no encontrado", 404);

  const isOwner = ticket.user.toString() === user._id.toString();
  const isAdmin = user.role === "admin";
  if (!isOwner && !isAdmin) {
    throw httpError("No tenés permisos para cancelar este ticket", 403);
  }

  if (ticket.status === "cancelled") {
    throw httpError("El ticket ya estaba cancelado", 409);
  }

  return ticketsRepository.update(ticketId, {
    status: "cancelled",
    cancelledAt: new Date(),
  });
};