import * as usersRepository from "../repositories/users.repository.js";
import { hashPassword } from "../utils/hash.js";

export const registerUser = async ({ first_name, last_name, email, password }) => {
  if (!first_name || !last_name || !email || !password) {
    const error = new Error("Todos los campos son obligatorios");
    error.status = 400;
    throw error;
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existing = await usersRepository.findByEmail(normalizedEmail);
  if (existing) {
    const error = new Error("El email ya está registrado");
    error.status = 409;
    throw error;
  }

  const hashedPassword = await hashPassword(password);

  // El rol siempre se fuerza a "user": no se puede crear admin/organizer desde el body
  const user = await usersRepository.create({
    first_name,
    last_name,
    email: normalizedEmail,
    password: hashedPassword,
    role: "user",
  });

  return user;
};