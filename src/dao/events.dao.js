import { Event } from "../models/event.js";

export const createEvent = (data) => Event.create(data);

export const findById = (id) => Event.findById(id);

export const find = (filter, { skip, limit, sort }) =>
  Event.find(filter).sort(sort).skip(skip).limit(limit);

export const countDocuments = (filter) => Event.countDocuments(filter);

export const findByIdAndUpdate = (id, data) =>
  Event.findByIdAndUpdate(id, data, { new: true, runValidators: true });