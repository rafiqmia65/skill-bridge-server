import { Request, Response, NextFunction } from "express";
import * as CategoryService from "./category.service.js";

interface CreateCategoryDTO {
  name: string;
}

/**
 * POST /api/categories
 * Private (Admin)
 */
export const addCategory = async (
  req: Request<{}, {}, CreateCategoryDTO>,
  res: Response,
  next: NextFunction,
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
  } catch (error: any) {
    // Prisma unique constraint error
    if (error.code === "P2002") {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    next(error);
  }
};

/**
 * GET /api/categories
 * Public
 */
export const listCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categories = await CategoryService.getAllCategories();

    return res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};
