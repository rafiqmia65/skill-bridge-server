import { Request, Response } from "express";
import * as ReviewService from "./review.service";

/**
 * @desc    Create a review for a booking
 */
export const createReviewController = async (req: Request, res: Response) => {
  const studentId = req.user!.id;
  const { bookingId, rating, comment } = req.body;

  const review = await ReviewService.createReview(studentId, {
    bookingId,
    rating,
    comment,
  });

  res.status(201).json({
    success: true,
    message: "Review submitted successfully",
    data: review,
  });
};
