import { prisma } from "../../lib/prisma.config";

interface CreateBookingInput {
  tutorProfileId: string;
  date: string; // ISO string from frontend
}

/**
 * @desc    Create a new booking for a student with a tutor
 */
export const createBooking = async (
  studentId: string,
  data: CreateBookingInput,
) => {
  const { tutorProfileId, date } = data;

  // Validate that tutor profile exists
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { id: tutorProfileId },
    include: { user: true },
  });

  if (!tutorProfile) {
    throw new Error("Tutor profile not found");
  }

  // Create the booking record
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

/**
 * @desc    Retrieve all bookings for a specific student
 */
export const getMyBookings = async (studentId: string) => {
  return prisma.booking.findMany({
    where: { studentId },
    orderBy: { createdAt: "desc" },
    include: {
      tutorProfile: {
        include: {
          user: { select: { name: true, image: true } },
          categories: true,
        },
      },
    },
  });
};

/**
 * @desc    Retrieve a single booking by ID for a student
 */
export const getBookingById = async (studentId: string, bookingId: string) => {
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, studentId },
    include: {
      tutorProfile: {
        include: {
          user: { select: { name: true, image: true } },
          categories: true,
        },
      },
    },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  return booking;
};
