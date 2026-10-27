import * as ticketsDao from "../dao/tickets.dao.js";
import { toTicketDTO } from "../dto/ticket.dto.js";

export const create = async (data) => toTicketDTO(await ticketsDao.createTicket(data));
export const getById = (id) => ticketsDao.findById(id);

export const getByUser = async (userId) => {
  const tickets = await ticketsDao.findByUser(userId);
  return tickets.map(toTicketDTO);
};

export const getByEvent = async (eventId) => {
  const tickets = await ticketsDao.findByEvent(eventId);
  return tickets.map(toTicketDTO);
};

export const getActiveQuantity = (eventId) => ticketsDao.sumActiveQuantity(eventId);
export const hasActiveTicket = (userId, eventId) => ticketsDao.findActiveByUserAndEvent(userId, eventId);
export const update = async (id, data) => toTicketDTO(await ticketsDao.findByIdAndUpdate(id, data));