import * as usersDao from "../dao/users.dao.js";
import { toUserDTO } from "../dto/user.dto.js";

export const create = async (data) => toUserDTO(await usersDao.createUser(data));

export const findByEmail = async (email) => toUserDTO(await usersDao.findByEmail(email));

// Único método que expone el hash: lo usa solo el service de autenticación para comparar contraseñas
export const findCredentialsByEmail = async (email) => {
  const user = await usersDao.findByEmail(email);
  if (!user) return null;
  return { user: toUserDTO(user), passwordHash: user.password };
};

export const findById = async (id) => toUserDTO(await usersDao.findById(id));