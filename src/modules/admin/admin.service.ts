import { prisma } from "../../lib/prisma.config";

/**
 * @desc Get all users from the database
 */
export const getAllUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isBanned: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

/**
 * @desc Update the user status
 * @param userId - ID of the user to update
 * @param status - Either "ACTIVE" or "BANNED"
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
