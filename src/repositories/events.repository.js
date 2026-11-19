import * as eventsDao from "../dao/events.dao.js";
import { toEventDTO } from "../dto/event.dto.js";

export const create = async (data) => toEventDTO(await eventsDao.createEvent(data));

export const getById = async (id) => toEventDTO(await eventsDao.findById(id));

export const getMany = async (filter, { skip, limit, sort }) => {
  const [events, total] = await Promise.all([
    eventsDao.find(filter, { skip, limit, sort }),
    eventsDao.countDocuments(filter),
  ]);
  return { data: events.map(toEventDTO), total };
};

export const update = async (id, data) => toEventDTO(await eventsDao.findByIdAndUpdate(id, data));