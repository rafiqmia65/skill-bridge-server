import { prisma } from "../../lib/prisma.config";

interface CreateBookingInput {
  tutorProfileId: string;
  date: string; // ISO string from frontend
}

/**
 * @desc Create a new booking for a student with a tutor
 */
export const createBooking = async (
  studentId: string,
  data: CreateBookingInput,
) => {
  const { tutorProfileId, date } = data;

  if (!tutorProfileId) throw new Error("TutorProfile ID is required");
  if (!date) throw new Error("Booking date is required");

  const bookingDate = new Date(date);
  if (isNaN(bookingDate.getTime()))
    throw new Error("Invalid booking date format");

  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { id: tutorProfileId },
    include: { user: true },
  });
  if (!tutorProfile) throw new Error("Tutor profile not found");

  return prisma.booking.create({
    data: {
      studentId,
      tutorId: tutorProfile.userId,
      tutorProfileId,
      date: bookingDate,
      status: "CONFIRMED",
    },
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
 * @desc Retrieve all bookings for a specific student
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
 * @desc Retrieve a single booking by ID for a student
 */
export const getBookingById = async (studentId: string, bookingId: string) => {
  if (!bookingId) throw new Error("Booking ID is required");

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      tutorProfile: {
        include: {
          user: { select: { name: true, image: true } },
          categories: true,
        },
      },
      student: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  // Optional: Check if the student owns this booking
  if (booking.studentId !== studentId) {
    throw new Error("Booking not found for this student");
  }

  return booking;
};

/**
 * @desc Retrieve all bookings (Admin only)
 */
export const getAllBookings = async () => {
  return prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      tutorProfile: {
        include: {
          user: { select: { name: true, image: true } },
          categories: true,
        },
      },
      student: {
        select: { id: true, name: true, email: true },
      },
    },
  });
};
