import { Router } from "express";
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  updateEventStatus,
} from "../controllers/events.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const router = Router();

router.get("/", getEvents);
router.get("/:id", getEventById);
router.post("/", auth, authorize("organizer", "admin"), createEvent);
router.put("/:id", auth, authorize("organizer", "admin"), updateEvent);
router.patch("/:id/status", auth, authorize("organizer", "admin"), updateEventStatus);

export default router;