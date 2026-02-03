import { prisma } from "../../lib/prisma.config";

interface CreateReviewInput {
  bookingId: string;
  rating: number;
  comment?: string;
}

/**
 * @desc    Create a review for a booking
 * @param   studentId ID of the student creating the review
 * @param   data Review payload (bookingId, rating, comment)
 * @returns Created review object
 */
export const createReview = async (
  studentId: string,
  data: CreateReviewInput,
) => {
  const { bookingId, rating, comment } = data;

  // Validate booking existence and ownership
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      tutorProfile: true, // include tutor info if needed
      review: true, // check if a review already exists
    },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.studentId !== studentId) {
    throw new Error("You are not authorized to review this booking");
  }

  if (booking.review) {
    throw new Error("Review already exists for this booking");
  }

  // Create review
  return prisma.review.create({
    data: {
      bookingId,
      studentId,
      rating,
      comment: comment || "", // ensure string for Prisma
    },
  });
};
