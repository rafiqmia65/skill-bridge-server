import { Router, type Router as ExpressRouter } from "express";
import * as CategoryController from "./category.controller";
import { authorize } from "../../middlewares/authorize";

const categoryRouter: ExpressRouter = Router();

/**
 * @route   POST /api/categories
 * @desc    Add a new category
 * @access  Private (Admin only)
 */
categoryRouter.post("/", authorize("ADMIN"), CategoryController.addCategory);

/**
 * @route   GET /api/categories
 * @desc    Retrieve all categories
 * @access  Public
 */
categoryRouter.get("/", CategoryController.listCategories);

export default categoryRouter;
