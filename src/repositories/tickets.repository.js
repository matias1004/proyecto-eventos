import * as ticketsDao from "../dao/tickets.dao.js";

export const create = (data) => ticketsDao.createTicket(data);
export const getById = (id) => ticketsDao.findById(id);
export const getByUser = (userId) => ticketsDao.findByUser(userId);
export const getByEvent = (eventId) => ticketsDao.findByEvent(eventId);
export const getActiveQuantity = (eventId) => ticketsDao.sumActiveQuantity(eventId);
export const update = (id, data) => ticketsDao.findByIdAndUpdate(id, data);