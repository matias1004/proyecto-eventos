import { Router } from "express";
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  updateEventStatus,
} from "../controllers/events.controller.js";
import { createTicket, getEventTickets } from "../controllers/tickets.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const router = Router();

router.get("/", getEvents);
router.get("/:id", getEventById);
router.post("/", auth, authorize("organizer", "admin"), createEvent);
router.put("/:id", auth, authorize("organizer", "admin"), updateEvent);
router.patch("/:id/status", auth, authorize("organizer", "admin"), updateEventStatus);

router.post("/:id/tickets", auth, createTicket);
router.get("/:id/tickets", auth, getEventTickets);

export default router;