import { Router, type Router as ExpressRouter } from "express";
import * as CategoryController from "./category.controller";
import { authorize } from "../middlewares/authorize";

const categoryRouter: ExpressRouter = Router();

// Admin only route
categoryRouter.post("/", authorize("ADMIN"), CategoryController.addCategory);

// Public route to get categories
categoryRouter.get("/", CategoryController.listCategories);

export default categoryRouter;
