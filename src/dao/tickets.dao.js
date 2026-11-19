import mongoose from "mongoose";
import { Ticket } from "../models/ticket.js";

// Capa DAO: único lugar que habla directamente con el modelo Ticket.
// Un ticket "activo" es el que no fue cancelado (pending o confirmed).
const ACTIVE_STATUSES = ["pending", "confirmed"];

export const createTicket = (data) => Ticket.create(data);

export const findById = (id) => Ticket.findById(id);

export const findByUser = (userId) =>
  Ticket.find({ user: userId })
    .populate("event", "title date location")
    .sort({ createdAt: -1 });

export const findByEvent = (eventId) =>
  Ticket.find({ event: eventId })
    .populate("user", "first_name last_name email")
    .sort({ createdAt: -1 });

export const findActiveByUserAndEvent = (userId, eventId) =>
  Ticket.findOne({ user: userId, event: eventId, status: { $in: ACTIVE_STATUSES } });

// Suma las entradas activas de un evento (para controlar el cupo).
export const sumActiveQuantity = async (eventId) => {
  const result = await Ticket.aggregate([
    {
      $match: {
        event: new mongoose.Types.ObjectId(eventId),
        status: { $in: ACTIVE_STATUSES },
      },
    },
    { $group: { _id: null, total: { $sum: "$quantity" } } },
  ]);
  return result[0]?.total || 0;
};

export const findByIdAndUpdate = (id, data) =>
  Ticket.findByIdAndUpdate(id, data, { new: true, runValidators: true });

export default {
  createTicket,
  findById,
  findByUser,
  findByEvent,
  findActiveByUserAndEvent,
  sumActiveQuantity,
  findByIdAndUpdate,
};