import { prisma } from "../../lib/prisma.config";

interface TutorProfileInput {
  bio: string;
  pricePerHr: number;
  categoryIds: string[];
}

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
    include: {
      categories: true,
    },
  });
};
