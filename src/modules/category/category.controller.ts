import { Request, Response } from "express";
import * as CategoryService from "./category.service";

/**
 * @desc    Add a new category (Admin only)
 * @route   POST /api/categories
 * @access  Private (Admin)
 */
export const addCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const category = await CategoryService.createCategory(name);

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      // Prisma unique constraint failed
      return res.status(400).json({ message: "Category already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    List all categories (Public)
 * @route   GET /api/categories
 * @access  Public
 */
export const listCategories = async (req: Request, res: Response) => {
  try {
    const categories = await CategoryService.getAllCategories();
    res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
