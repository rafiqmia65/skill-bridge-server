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

/**
 * Get all bookings of a student
 */
export const getMyBookings = async (studentId: string) => {
  return prisma.booking.findMany({
    where: {
      studentId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      tutorProfile: {
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
          categories: true,
        },
      },
    },
  });
};

/** Get a single booking by ID */
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
