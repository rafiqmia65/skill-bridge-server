import { RequestHandler } from "express";
import * as CategoryService from "./category.service.js";

interface CreateCategoryDTO {
  name: string;
}

/**
 * POST /api/categories
 * Private (Admin)
 */
export const addCategory: RequestHandler<{}, {}, CreateCategoryDTO> = async (
  req,
  res,
  next,
) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const category = await CategoryService.createCategory(name);

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (err: any) {
    // Handle unique constraint error (Prisma)
    if (err.code === "P2002") {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    next(err);
  }
};

/**
 * GET /api/categories
 * Public
 */
export const listCategories: RequestHandler = async (req, res, next) => {
  try {
    const categories = await CategoryService.getAllCategories();

    return res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (err) {
    next(err);
  }
};
