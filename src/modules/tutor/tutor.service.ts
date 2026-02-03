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
 * Get all tutors with optional filters
 * ----------------------- */
export const getAllTutors = async (filters: any) => {
  const { search, category, minPrice, maxPrice, rating } = filters;

  return prisma.tutorProfile.findMany({
    where: {
      ...(search && {
        user: { name: { contains: search, mode: "insensitive" } },
      }),
      ...(category && { categories: { some: { name: category } } }),
      ...(minPrice || maxPrice
        ? {
            pricePerHr: {
              gte: Number(minPrice) || undefined,
              lte: Number(maxPrice) || undefined,
            },
          }
        : {}),
      ...(rating && { rating: { gte: Number(rating) } }),
    },
    include: {
      user: { select: { name: true, image: true } },
      categories: true,
      availability: true,
    },
  });
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
