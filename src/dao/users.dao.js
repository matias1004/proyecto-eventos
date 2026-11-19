import { User } from "../models/user.js";

// Capa DAO: único lugar que habla directamente con el modelo User.

export const createUser = (data) => User.create(data);

export const findByEmail = (email) => User.findOne({ email });

export const findById = (id) => User.findById(id);

export default { createUser, findByEmail, findById };