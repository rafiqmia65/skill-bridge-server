import { Router, type Router as ExpressRouter } from "express";
import {
  updateAvailabilityController,
  upsertTutorProfile,
} from "./tutor.controller";
import { authorize } from "../middlewares/authorize";
import { Role } from "../../constants/role";

const tutorRouter: ExpressRouter = Router();

// Update tutor profile (bio, price, categories)
tutorRouter.put("/profile", authorize(Role.TUTOR), upsertTutorProfile);

// Update tutor availability
tutorRouter.put(
  "/availability",
  authorize(Role.TUTOR),
  updateAvailabilityController,
);

export default tutorRouter;
