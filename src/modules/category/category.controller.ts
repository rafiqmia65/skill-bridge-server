import { Request, Response, NextFunction } from "express";
import * as CategoryService from "./category.service.js";

/**
 * @desc    Add a new category (Admin only)
 * @route   POST /api/categories
 * @access  Private (Admin)
 */
export const addCategory = async (
  req: Request<{}, any, { name: string }>,
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

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error: any) {
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
 * @desc    List all categories (Public)
 * @route   GET /api/categories
 * @access  Public
 */
export const listCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categories = await CategoryService.getAllCategories();

    res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};
