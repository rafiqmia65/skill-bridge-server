import { prisma } from "../../lib/prisma.config";

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

// Service for profile
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

export const updateAvailability = async (
  userId: string,
  slots: AvailabilitySlot[],
) => {
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { userId },
  });

  if (!tutorProfile) {
    throw new Error("Tutor profile not found");
  }

  const tutorId = tutorProfile.id;

  await prisma.availability.deleteMany({
    where: { tutorId },
  });

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
