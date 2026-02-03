import { prisma } from "../../lib/prisma.config";

/**
 * Get all users
 */
export const getAllUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

/**
 * @desc    Update user status
 */
export const updateUserStatus = async (
  userId: string,
  status: "ACTIVE" | "BANNED",
) => {
  const isBanned = status === "BANNED";

  return prisma.user.update({
    where: { id: userId },
    data: { isBanned },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isBanned: true,
    },
  });
};
