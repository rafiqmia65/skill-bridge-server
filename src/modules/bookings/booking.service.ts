import { prisma } from "../../lib/prisma.config";

interface CreateBookingInput {
  tutorProfileId: string;
  date: string; // ISO string from frontend
}

/**
 * Create a new booking
 */
export const createBooking = async (
  studentId: string,
  data: CreateBookingInput,
) => {
  const { tutorProfileId, date } = data;

  // Validate tutor profile
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { id: tutorProfileId },
    include: { user: true },
  });

  if (!tutorProfile) {
    throw new Error("Tutor profile not found");
  }

  // Create booking
  return prisma.booking.create({
    data: {
      studentId,
      tutorId: tutorProfile.userId,
      tutorProfileId,
      date: new Date(date),
      status: "CONFIRMED",
    },
  });
};
