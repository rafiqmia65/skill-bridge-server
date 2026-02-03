import { prisma } from "../../lib/prisma.config";

/**
 * @desc    Create a new category in the database
 * @param   name Category name
 * @returns Created category object
 */
export const createCategory = async (name: string) => {
  return prisma.category.create({
    data: { name },
  });
};

/**
 * @desc    Retrieve all categories from the database
 * @returns List of all categories
 */
export const getAllCategories = async () => {
  return prisma.category.findMany();
};
