import { Ticket } from "../models/ticket.js";

export const createTicket = (data) => Ticket.create(data);

export const findById = (id) => Ticket.findById(id);

export const findByUser = (userId) =>
  Ticket.find({ user: userId }).populate("event", "title date location");

export const findByEvent = (eventId) =>
  Ticket.find({ event: eventId }).populate("user", "first_name last_name email");

export const sumActiveQuantity = async (eventId) => {
  const result = await Ticket.aggregate([
    { $match: { event: eventId, status: { $in: ["confirmed", "pending"] } } },
    { $group: { _id: null, total: { $sum: "$quantity" } } },
  ]);
  return result[0]?.total || 0;
};

export const findByIdAndUpdate = (id, data) =>
  Ticket.findByIdAndUpdate(id, data, { new: true, runValidators: true });