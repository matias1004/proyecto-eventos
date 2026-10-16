import { User } from "../models/user.js";
export const createUser = (data) => User.create(data);
export const findByEmail = (email) => User.findOne({ email });
export const findById = (id) => User.findById(id);
export const findAll = () => User.find();