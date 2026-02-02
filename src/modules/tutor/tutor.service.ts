import { prisma } from "../../lib/prisma.config";

/**
 * Tutor profile input type
 */
interface TutorProfileInput {
  bio: string;
  pricePerHr: number;
  categoryIds: string[];
}

/**
 * Availability slot input type
 */
interface AvailabilitySlot {
  day: string;
  startTime: string;
  endTime: string;
}

/**
 * Create or update tutor profile
 */
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

/**
 * Update tutor availability slots
 */
export const updateAvailability = async (
  userId: string,
  slots: AvailabilitySlot[],
) => {
  // Find tutor profile by logged-in user
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { userId },
  });

  if (!tutorProfile) {
    throw new Error("Tutor profile not found");
  }

  const tutorId = tutorProfile.id;

  // Remove old availability slots
  await prisma.availability.deleteMany({
    where: { tutorId },
  });

  // Create new availability slots
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

/**
 * Get all tutors with optional filters (Public)
 */
export const getAllTutors = async (filters: any) => {
  const { search, category, minPrice, maxPrice, rating } = filters;

  return prisma.tutorProfile.findMany({
    where: {
      // Search by tutor name
      ...(search && {
        user: {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      }),

      // Filter by category
      ...(category && {
        categories: {
          some: {
            name: category,
          },
        },
      }),

      // Filter by price range
      ...(minPrice || maxPrice
        ? {
            pricePerHr: {
              gte: minPrice ? Number(minPrice) : undefined,
              lte: maxPrice ? Number(maxPrice) : undefined,
            },
          }
        : {}),

      // Filter by rating
      ...(rating && {
        rating: {
          gte: Number(rating),
        },
      }),
    },

    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
      categories: true,
      availability: true,
    },
  });
};
