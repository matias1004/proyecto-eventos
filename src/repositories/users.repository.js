import * as usersDao from "../dao/users.dao.js";
import { toUserDTO } from "../dto/user.dto.js";

export const create = async (data) => {
  const user = await usersDao.createUser(data);
  return toUserDTO(user);
};

export const findByEmail = (email) => usersDao.findByEmail(email);

export const findById = async (id) => {
  const user = await usersDao.findById(id);
  return toUserDTO(user);
};

export const findAll = async () => {
  const users = await usersDao.findAll();
  return users.map(toUserDTO);
};