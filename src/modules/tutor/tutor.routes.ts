import express, { Router } from "express";
import {
  upsertTutorProfile,
  updateAvailabilityController,
  getTutorDashboardController,
} from "./tutor.controller";
import { authorize } from "../../middlewares/authorize";
import { Role } from "../../constants/role";

const tutorRouter: express.Router = Router();

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

/**
 * @route   GET /api/tutor/dashboard
 */
tutorRouter.get(
  "/dashboard",
  authorize(Role.TUTOR),
  getTutorDashboardController,
);

export default tutorRouter;
