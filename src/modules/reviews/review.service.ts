import { prisma } from "../../lib/prisma.config";

interface CreateReviewInput {
  bookingId: string;
  rating: number;
  comment?: string;
}

/**
 * Create a review for a booking
 */
export const createReview = async (
  studentId: string,
  data: CreateReviewInput,
) => {
  const { bookingId, rating, comment } = data;

  // Check if booking exists and belongs to the student
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      tutorProfile: true,
      review: true, // include review to check if it exists
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
      comment: comment || "", // ensure string
    },
  });
};
