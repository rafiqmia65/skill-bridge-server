import { RequestWithUser, AppResponse } from "../../types/express.js";
import * as ReviewService from "./review.service.js";

/**
 * @desc    Controller to create a review
 * @route   POST /api/reviews
 * @access  Private (Student)
 */
export const createReviewController = async (
  req: RequestWithUser<{ bookingId: string; rating: number; comment: string }>,
  res: AppResponse,
) => {
  try {
    const studentId = req.user!.id; // authenticated student
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
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
