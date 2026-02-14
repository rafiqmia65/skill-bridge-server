import { Request, Response, NextFunction } from "express";
import * as TutorService from "./tutor.service.js";

/**
 * Create or update tutor profile
 * PUT /api/tutor/profile
 */
export const upsertTutorProfile = async (
  req: Request<{}, any, any>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).user?.id;
    const payload = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const profile = await TutorService.upsertTutorProfile(userId, payload);

    return res.status(200).json({
      success: true,
      message: "Tutor profile saved successfully",
      data: profile,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update tutor availability slots
 * PUT /api/tutor/availability
 */
export const updateAvailabilityController = async (
  req: Request<{}, any, { slots: any[] }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).user?.id;
    const { slots } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const availability = await TutorService.updateAvailability(userId, slots);

    return res.status(200).json({
      success: true,
      message: "Availability updated successfully",
      data: availability,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all tutors with optional filters
 * GET /api/tutors
 */
export const getAllTutorsController = async (
  req: Request<{}, any, any, Record<string, any>>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { search, category, minPrice, maxPrice, rating, page, limit } =
      req.query;

    const filters: any = {
      search: search ? String(search) : undefined,
      category: category ? String(category) : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      rating: rating ? Number(rating) : undefined,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 12,
    };

    const result = await TutorService.getAllTutors(filters);

    return res.status(200).json({
      success: true,
      message: "Tutors retrieved successfully",
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get a single tutor by ID
 * GET /api/tutors/:id
 */
export const getTutorByIdController = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const tutorId = req.params.id;

    if (!tutorId) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid tutor ID" });
    }

    const tutor = await TutorService.getTutorById(tutorId);

    return res.status(200).json({
      success: true,
      message: "Tutor retrieved successfully",
      data: tutor,
    });
  } catch (err: any) {
    return res
      .status(404)
      .json({ success: false, message: err.message || "Tutor not found" });
  }
};

/**
 * Get tutor dashboard stats & sessions
 * GET /api/tutor/dashboard
 */
export const getTutorDashboardController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const dashboardData = await TutorService.getTutorDashboard(userId);

    return res.status(200).json({
      success: true,
      message: "Dashboard data retrieved",
      data: dashboardData,
    });
  } catch (err) {
    next(err);
  }
};
