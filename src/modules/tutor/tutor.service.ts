import { prisma } from "../../lib/prisma.config";

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
