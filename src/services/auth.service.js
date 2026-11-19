import * as usersRepository from "../repositories/users.repository.js";
import { hashPassword, comparePassword } from "../utils/hash.js";

const httpError = (message, status) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const normalizeEmail = (email) => email.trim().toLowerCase();

export const registerUser = async ({ first_name, last_name, email, password } = {}) => {
  const fields = [first_name, last_name, email, password];
  if (fields.some((value) => typeof value !== "string" || !value.trim())) {
    throw httpError("Todos los campos son obligatorios", 400);
  }

  const normalizedEmail = normalizeEmail(email);

  const existing = await usersRepository.findByEmail(normalizedEmail);
  if (existing) throw httpError("El email ya está registrado", 409);

  // El rol siempre se fuerza a "user": no se puede crear admin/organizer desde el body
  return usersRepository.create({
    first_name,
    last_name,
    email: normalizedEmail,
    password: await hashPassword(password),
    role: "user",
  });
};

export const validateCredentials = async (email, password) => {
  if (typeof email !== "string" || typeof password !== "string") return null;

  const credentials = await usersRepository.findCredentialsByEmail(normalizeEmail(email));
  if (!credentials) return null;

  const isValid = await comparePassword(password, credentials.passwordHash);
  return isValid ? credentials.user : null;
};

export const getUserById = (id) => usersRepository.findById(id);