import { Request, Response } from "express";
import * as CategoryService from "./category.service";

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
      // Unique constraint failed
      return res.status(400).json({ message: "Category already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

export const listCategories = async (req: Request, res: Response) => {
  const categories = await CategoryService.getAllCategories();
  res.status(200).json({
    success: true,
    data: categories,
  });
};
