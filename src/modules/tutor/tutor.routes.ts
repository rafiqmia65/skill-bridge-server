import { Router, type Router as ExpressRouter } from "express";
import {
  getAllTutorsController,
  updateAvailabilityController,
  upsertTutorProfile,
} from "./tutor.controller";
import { authorize } from "../../middlewares/authorize";
import { Role } from "../../constants/role";

const tutorRouter: ExpressRouter = Router();

/**
 * @route   PUT /api/tutor/profile
 * @desc    Create or update tutor profile
 * @access  Private (Tutor)
 */
tutorRouter.put("/profile", authorize(Role.TUTOR), upsertTutorProfile);

/**
 * @route   PUT /api/tutor/availability
 * @desc    Update tutor availability slots
 * @access  Private (Tutor)
 */
tutorRouter.put(
  "/availability",
  authorize(Role.TUTOR),
  updateAvailabilityController,
);

export default tutorRouter;
