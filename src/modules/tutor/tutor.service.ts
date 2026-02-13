import { prisma } from "../../lib/prisma.js";


/** -----------------------
 * Types
 * ----------------------- */
interface TutorProfileInput {
  bio: string;
  pricePerHr: number;
  categoryIds: string[];
}

interface AvailabilitySlot {
  day: string;
  startTime: string;
  endTime: string;
}

export interface TutorFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  page?: number;
  limit?: number;
}

/** -----------------------
 * Create or update tutor profile
 * ----------------------- */
export const upsertTutorProfile = async (
  userId: string,
  data: TutorProfileInput,
) => {
  return prisma.tutorProfile.upsert({
    where: { userId },
    update: {
      bio: data.bio,
      pricePerHr: data.pricePerHr,
      categories: {
        set: [],
        connect: data.categoryIds.map((id) => ({ id })),
      },
    },
    create: {
      userId,
      bio: data.bio,
      pricePerHr: data.pricePerHr,
      categories: {
        connect: data.categoryIds.map((id) => ({ id })),
      },
    },
    include: { categories: true },
  });
};

/** -----------------------
 * Update tutor availability slots
 * ----------------------- */
export const updateAvailability = async (
  userId: string,
  slots: AvailabilitySlot[],
) => {
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { userId },
  });
  if (!tutorProfile) throw new Error("Tutor profile not found");

  const tutorId = tutorProfile.id;

  // Remove old slots
  await prisma.availability.deleteMany({ where: { tutorId } });

  // Add new slots
  const createdSlots = await Promise.all(
    slots.map((slot) =>
      prisma.availability.create({
        data: {
          day: slot.day,
          startTime: new Date(slot.startTime),
          endTime: new Date(slot.endTime),
          tutorId,
        },
      }),
    ),
  );

  return createdSlots;
};

/** -----------------------
 * Get all tutors with optional filters & pagination
 * ----------------------- */
export const getAllTutors = async (filters: TutorFilters) => {
  const {
    search,
    category,
    minPrice,
    maxPrice,
    rating,
    page = 1,
    limit = 12,
  } = filters;

  const andConditions: any[] = [];

  if (search) {
    andConditions.push({
      OR: [
        { user: { name: { contains: search, mode: "insensitive" } } },
        {
          categories: {
            some: { name: { contains: search, mode: "insensitive" } },
          },
        },
      ],
    });
  }

  if (category) {
    andConditions.push({
      categories: {
        some: { name: { contains: category, mode: "insensitive" } },
      },
    });
  }

  if (minPrice || maxPrice) {
    andConditions.push({
      pricePerHr: {
        gte: minPrice ? Number(minPrice) : undefined,
        lte: maxPrice ? Number(maxPrice) : undefined,
      },
    });
  }

  if (rating) {
    andConditions.push({ rating: { gte: Number(rating) } });
  }

  const where: any = {};
  if (andConditions.length) where.AND = andConditions;

  const total = await prisma.tutorProfile.count({ where });

  const tutors = await prisma.tutorProfile.findMany({
    where,
    include: {
      user: { select: { name: true, image: true } },
      categories: true,
      availability: true,
    },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: "desc" },
  });

  return {
    tutors,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/** -----------------------
 * Get single tutor by ID
 * ----------------------- */
export const getTutorById = async (tutorId: string) => {
  const tutor = await prisma.tutorProfile.findUnique({
    where: { id: tutorId },
    include: {
      user: { select: { name: true, image: true } },
      categories: true,
      availability: true,
    },
  });

  if (!tutor) throw new Error("Tutor not found");
  return tutor;
};

/** -----------------------
 * Dashboard Overview
 * ----------------------- */
export const getTutorDashboard = async (userId: string) => {
  // Tutor profile + categories + availability
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { userId },
    include: {
      categories: true,
      availability: true,
      user: { select: { name: true, email: true, image: true } },
    },
  });

  if (!tutorProfile) throw new Error("Tutor profile not found");

  // Fetch bookings with student and review
  const bookings = await prisma.booking.findMany({
    where: { tutorId: userId },
    include: {
      student: { select: { name: true, email: true } },
      review: true,
    },
    orderBy: { date: "desc" },
  });

  // Compute stats
  const availabilityCount = tutorProfile.availability.length;
  const totalSessions = bookings.length + availabilityCount; // include availability
  const upcomingSessions =
    bookings.filter((b: any) => b.status === "CONFIRMED").length +
    availabilityCount; // treat all slots as upcoming
  const completedSessions = bookings.filter(
    (b: any) => b.status === "COMPLETED",
  ).length;
  const cancelledSessions = bookings.filter(
    (b: any) => b.status === "CANCELLED",
  ).length;
  const totalEarnings = completedSessions * tutorProfile.pricePerHr;

  // Recent reviews
  const reviews = bookings
    .filter((b: any) => b.review)
    .map((b: any) => ({
      id: b.review!.id,
      rating: b.review!.rating,
      comment: b.review!.comment,
      studentName: b.student.name,
      date: b.review!.createdAt,
    }));

  // Response
  return {
    profile: {
      name: tutorProfile.user.name,
      email: tutorProfile.user.email,
      image: tutorProfile.user.image,
      bio: tutorProfile.bio,
      pricePerHr: tutorProfile.pricePerHr,
      rating: tutorProfile.rating,
      categories: tutorProfile.categories.map((c: any) => c.name),
      availability: tutorProfile.availability.map((a: any) => ({
        day: a.day,
        startTime: a.startTime,
        endTime: a.endTime,
      })),
    },
    stats: {
      totalSessions,
      upcomingSessions,
      completedSessions,
      cancelledSessions,
      totalEarnings,
      rating: tutorProfile.rating,
    },
    upcomingSessions: bookings.filter((b: any) => b.status === "CONFIRMED"),
    recentSessions: bookings.slice(0, 5).map((b: any) => ({
      id: b.id,
      studentName: b.student.name,
      date: b.date,
      status: b.status,
      review: b.review
        ? { rating: b.review.rating, comment: b.review.comment }
        : null,
    })),
    reviews,
  };
};
