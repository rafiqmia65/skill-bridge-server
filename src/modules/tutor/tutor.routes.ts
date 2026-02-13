import { Router } from "express";
import { authorize } from "../../middlewares/authorize.js";
import { Role } from "../../constants/role.js";
import { getTutorDashboardController, updateAvailabilityController, upsertTutorProfile } from "./tutor.controller.js";

const tutorRouter = Router();

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
