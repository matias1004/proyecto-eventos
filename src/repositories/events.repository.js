import * as eventsDao from "../dao/events.dao.js";

export const create = (data) => eventsDao.createEvent(data);

export const getById = (id) => eventsDao.findById(id);

export const getMany = async (filter, { skip, limit, sort }) => {
  const [data, total] = await Promise.all([
    eventsDao.find(filter, { skip, limit, sort }),
    eventsDao.countDocuments(filter),
  ]);
  return { data, total };
};

export const update = (id, data) => eventsDao.findByIdAndUpdate(id, data);