import express, { Router } from "express";
import { Role } from "../../constants/role";
import { authorize } from "../../middlewares/authorize";
import { createReviewController } from "./review.controller";

const reviewRouter: express.Router = Router();

/**
 * @route   POST /api/reviews
 * @desc    Create a review for a booking (student can leave review after attending session)
 * @access  Private (Student)
 */
reviewRouter.post("/", authorize(Role.STUDENT), createReviewController);

export default reviewRouter;
