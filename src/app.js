import express from "express";
import cookieParser from "cookie-parser";
import passport from "passport";
import { initPassport } from "./config/passport.config.js";
import sessionsRouter from "./routes/sessions.router.js";
import eventsRouter from "./routes/events.router.js";
import ticketsRouter from "./routes/tickets.router.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

initPassport();
app.use(passport.initialize());

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Servidor activo" });
});

app.use("/api/sessions", sessionsRouter);
app.use("/api/events", eventsRouter);
app.use("/api/tickets", ticketsRouter);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ status: "error", message: err.message || "Error interno del servidor" });
});

export default app;