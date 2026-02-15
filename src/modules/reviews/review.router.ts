import express from "express";
import { Role } from "../../constants/role.js";
import { authorize } from "../../middlewares/authorize.js";
import { createReviewController } from "./review.controller.js";

const reviewRouter: ReturnType<typeof express.Router> = express.Router();

/**
 * @route   POST /api/reviews
 * @desc    Create a review for a booking (student can leave review after attending session)
 * @access  Private (Student)
 */
reviewRouter.post("/", authorize(Role.STUDENT), createReviewController);

export default reviewRouter;
