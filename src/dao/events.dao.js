import { Event } from "../models/event.js";

// Capa DAO: único lugar que habla directamente con el modelo de Mongoose.

export const createEvent = (data) => Event.create(data);

export const findById = (id) => Event.findById(id);

export const find = (filter = {}, { skip = 0, limit = 10, sort = { date: 1 } } = {}) =>
  Event.find(filter).sort(sort).skip(skip).limit(limit);

export const countDocuments = (filter = {}) => Event.countDocuments(filter);

export const findByIdAndUpdate = (id, data) =>
  Event.findByIdAndUpdate(id, data, { new: true, runValidators: true });

// También se exporta como objeto, por si el repository lo importa como default.
export default { createEvent, findById, find, countDocuments, findByIdAndUpdate };