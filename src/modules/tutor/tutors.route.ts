import { Router, type Router as ExpressRouter } from "express";
import { getAllTutorsController } from "./tutor.controller";

const tutorsRouter: ExpressRouter = Router();

/**
 * @route   GET /api/tutors
 * @desc    Get all approved tutors with filters (Public)
 * @access  Public
 */
tutorsRouter.get("/", getAllTutorsController);

export default tutorsRouter;
