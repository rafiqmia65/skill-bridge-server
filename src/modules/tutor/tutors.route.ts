import { Router, type Router as ExpressRouter } from "express";
import {
  getAllTutorsController,
  getTutorByIdController,
} from "./tutor.controller";

const tutorsRouter: ExpressRouter = Router();

/**
 * @route   GET /api/tutors
 * @desc    Get all approved tutors with optional filters (Public)
 * @access  Public
 */
tutorsRouter.get("/", getAllTutorsController);

/**
 * @route   GET /api/tutors/:id
 * @desc    Get single tutor details by ID (Public)
 * @access  Public
 */
tutorsRouter.get("/:id", getTutorByIdController);

export default tutorsRouter;
