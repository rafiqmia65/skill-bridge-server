import { Router, type Router as ExpressRouter } from "express";
import { Role } from "../../constants/role";
import { authorize } from "../../middlewares/authorize";
import { createReviewController } from "./review.controller";

const reviewRouter: ExpressRouter = Router();

/**
 * @route   POST /api/reviews
 * @desc    Create a review for a tutor
 * @access  Private (Student)
 */
reviewRouter.post("/", authorize(Role.STUDENT), createReviewController);

export default reviewRouter;
