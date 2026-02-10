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

  /**
   * Update student profile by userId
   */
  updateProfile: async (
    userId: string,
    payload: { name?: string; email?: string; image?: string | null },
  ) => {
    // Only keep fields that exist in payload
    const data: Record<string, any> = {};
    if (payload.name !== undefined) data.name = payload.name;
    if (payload.email !== undefined) data.email = payload.email;
    if (payload.image !== undefined) data.image = payload.image;

    if (Object.keys(data).length === 0) {
      throw new Error("No fields provided to update");
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  },
};
