import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../src/config/db.js";
import * as usersDao from "../src/dao/users.dao.js";
import { hashPassword } from "../src/utils/hash.js";

const DEMO_PASSWORD = process.env.SEED_PASSWORD || "Test1234";

const demoUsers = [
  { first_name: "Admin", last_name: "Demo", email: "admin@demo.com", role: "admin" },
  { first_name: "Organizador", last_name: "Uno", email: "organizer@demo.com", role: "organizer" },
  { first_name: "Organizador", last_name: "Dos", email: "organizer2@demo.com", role: "organizer" },
  { first_name: "Usuario", last_name: "Demo", email: "user@demo.com", role: "user" },
];

const seed = async () => {
  await connectDB();

  if (mongoose.connection.readyState !== 1) {
    console.error("No hay conexión a MongoDB. Revisá MONGO_URL en tu .env");
    process.exit(1);
  }

  const password = await hashPassword(DEMO_PASSWORD);

  for (const user of demoUsers) {
    const existing = await usersDao.findByEmail(user.email);
    if (existing) {
      console.log(`Ya existe: ${user.email}`);
      continue;
    }
    await usersDao.createUser({ ...user, password });
    console.log(`Creado: ${user.email} (${user.role})`);
  }

  await mongoose.disconnect();
};

seed().catch((error) => {
  console.error("Error al ejecutar el seed:", error.message);
  process.exit(1);
});