import { Request, Response, NextFunction } from "express";
import * as TutorService from "./tutor.service.js";

/**
 * @desc    Create or update tutor profile
 * @route   PUT /api/tutor/profile
 * @access  Private (Tutor)
 */
export const upsertTutorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).user?.id;
    const payload = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const profile = await TutorService.upsertTutorProfile(userId, payload);

    res.status(200).json({
      success: true,
      message: "Tutor profile saved successfully",
      data: profile,
    });
  } catch (error: any) {
    next(error);
  }
};

/**
 * @desc    Update tutor availability slots
 * @route   PUT /api/tutor/availability
 * @access  Private (Tutor)
 */
export const updateAvailabilityController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).user?.id;
    const { slots } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const availability = await TutorService.updateAvailability(userId, slots);

    res.status(200).json({
      success: true,
      message: "Availability updated successfully",
      data: availability,
    });
  } catch (error: any) {
    next(error);
  }
};

/**
 * @desc    Get all tutors with optional filters
 * @route   GET /api/tutors
 * @access  Public
 */
export const getAllTutorsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { search, category, minPrice, maxPrice, rating, page, limit } =
      req.query;

    const filters: any = {
      search: search as string,
      category: category as string,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 12,
    };

    if (minPrice !== undefined) filters.minPrice = Number(minPrice);
    if (maxPrice !== undefined) filters.maxPrice = Number(maxPrice);
    if (rating !== undefined) filters.rating = Number(rating);

    const result = await TutorService.getAllTutors(filters);

    res.status(200).json({
      success: true,
      message: "Tutors retrieved successfully",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single tutor by ID
 * @route   GET /api/tutors/:id
 * @access  Public
 */
export const getTutorByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const tutorId = req.params.id;

    // ❗ handle string[]
    if (!tutorId || Array.isArray(tutorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid tutor ID",
      });
    }

    const tutor = await TutorService.getTutorById(tutorId);

    res.status(200).json({
      success: true,
      message: "Tutor retrieved successfully",
      data: tutor,
    });
  } catch (error: any) {
    next(error);
  }
};

/**
 * @desc    Get tutor dashboard stats & sessions
 * @route   GET /api/tutor/dashboard
 * @access  Private (Tutor)
 */
export const getTutorDashboardController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const dashboardData = await TutorService.getTutorDashboard(userId);

    res.status(200).json({
      success: true,
      message: "Tutor dashboard data retrieved successfully",
      data: dashboardData,
    });
  } catch (error: any) {
    next(error);
  }
};
