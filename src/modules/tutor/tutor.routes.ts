import express from "express";
import { authorize } from "../../middlewares/authorize.js";
import { Role } from "../../constants/role.js";
import {
  getTutorDashboardController,
  updateAvailabilityController,
  upsertTutorProfile,
} from "./tutor.controller.js";

const tutorRouter: ReturnType<typeof express.Router> = express.Router();

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
 * @desc    Get tutor dashboard data
 * @access  Private (Tutor)
 */
tutorRouter.get(
  "/dashboard",
  authorize(Role.TUTOR),
  getTutorDashboardController,
);

export default tutorRouter;
