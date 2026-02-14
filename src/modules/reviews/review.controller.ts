import { Request, Response, NextFunction } from "express";
import * as ReviewService from "./review.service.js";

/**
 * @desc    Controller to create a review
 * @route   POST /api/reviews
 * @access  Private (Student)
 */
export const createReviewController = async (
  req: Request<{}, any, { bookingId: string; rating: number; comment: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = (req as any).user;

    if (!user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { bookingId, rating, comment } = req.body;

    const review = await ReviewService.createReview(user.id, {
      bookingId,
      rating,
      comment,
    });

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: review,
    });
  } catch (error: any) {
    next(error);
  }
};
