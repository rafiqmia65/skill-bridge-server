import { prisma } from "../../lib/prisma.config";

export const StudentProfileService = {
  /**
   * Get student profile by userId
   */
  getProfile: async (userId: string) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) throw new Error("Student profile not found");

    return user;
  },
};
