import * as usersDao from "../dao/users.dao.js";

const toSafeUser = (user) => {
  if (!user) return null;
  const { password, __v, ...safe } = user.toObject();
  return safe;
};

export const create = async (data) => {
  const user = await usersDao.createUser(data);
  return toSafeUser(user);
};

export const findByEmail = (email) => usersDao.findByEmail(email);

export const findById = async (id) => {
  const user = await usersDao.findById(id);
  return toSafeUser(user);
};

export const findAll = async () => {
  const users = await usersDao.findAll();
  return users.map(toSafeUser);
};