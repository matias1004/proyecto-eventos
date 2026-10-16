import mongoose from "mongoose";

export const connectDB = async () => {
  const mongoUrl = process.env.MONGO_URL;

  if (!mongoUrl) {
    console.warn("⚠️  MONGO_URL no está definida. El servidor seguirá activo sin conexión a la base de datos.");
    return;
  }

  try {
    await mongoose.connect(mongoUrl);
    console.log("✅ Conectado a MongoDB");
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB:", error.message);
  }
};