import { RequestHandler } from "express";
import * as ReviewService from "./review.service.js";

interface CreateReviewDTO {
  bookingId: string;
  rating: number;
  comment: string;
}

/**
 * POST /api/reviews
 * Private (Student)
 */
export const createReviewController: RequestHandler<
  {},
  {},
  CreateReviewDTO
> = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { bookingId, rating, comment } = req.body;

    const review = await ReviewService.createReview(userId, {
      bookingId,
      rating,
      comment,
    });

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: review,
    });
  } catch (err) {
    next(err);
  }
};
