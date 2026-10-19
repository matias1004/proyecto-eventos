import * as eventsRepository from "../repositories/events.repository.js";

const REQUIRED_FIELDS = ["title", "description", "category", "date", "location", "capacity", "price"];
const VALID_STATUSES = ["draft", "published", "cancelled", "finished"];

const httpError = (message, status) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const assertOwnership = (event, user) => {
  const isOwner = event.organizer.toString() === user._id.toString();
  const isAdmin = user.role === "admin";
  if (!isOwner && !isAdmin) {
    throw httpError("No tenés permisos para modificar este evento", 403);
  }
};

export const createEvent = async (data, user) => {
  for (const field of REQUIRED_FIELDS) {
    if (data[field] === undefined || data[field] === null || data[field] === "") {
      throw httpError(`El campo "${field}" es obligatorio`, 400);
    }
  }

  const event = await eventsRepository.create({
    ...data,
    organizer: user._id,
  });

  return event;
};

export const listEvents = async (query) => {
  const { status, category, location, dateFrom, dateTo, sort } = query;

  const filter = {};
  if (status) filter.status = status;
  if (category) filter.category = category;
  if (location) filter.location = location;
  if (dateFrom || dateTo) {
    filter.date = {};
    if (dateFrom) filter.date.$gte = new Date(dateFrom);
    if (dateTo) filter.date.$lte = new Date(dateTo);
  }

  const page = Math.max(parseInt(query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit) || 10, 1), 100);
  const skip = (page - 1) * limit;

  const sortField = sort || "date";

  const { data, total } = await eventsRepository.getMany(filter, { skip, limit, sort: sortField });
  const totalPages = Math.ceil(total / limit) || 1;

  return { data, page, limit, total, totalPages };
};

export const getEventById = async (id) => {
  const event = await eventsRepository.getById(id);
  if (!event) throw httpError("Evento no encontrado", 404);
  return event;
};

export const updateEvent = async (id, data, user) => {
  const event = await eventsRepository.getById(id);
  if (!event) throw httpError("Evento no encontrado", 404);

  assertOwnership(event, user);

  const updated = await eventsRepository.update(id, data);
  return updated;
};

export const updateEventStatus = async (id, status, user) => {
  if (!VALID_STATUSES.includes(status)) {
    throw httpError(`El estado debe ser uno de: ${VALID_STATUSES.join(", ")}`, 400);
  }

  const event = await eventsRepository.getById(id);
  if (!event) throw httpError("Evento no encontrado", 404);

  assertOwnership(event, user);

  // Cancelar = cambio de estado a "cancelled", nunca se borra el documento físicamente
  const updated = await eventsRepository.update(id, { status });
  return updated;
};