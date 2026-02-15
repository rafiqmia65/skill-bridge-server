import { Request, Response, NextFunction } from "express";
import * as TutorService from "./tutor.service.js";

/* ================================
   Types
================================ */

interface AvailabilityBody {
  slots: any[];
}

interface TutorQuery {
  search?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  rating?: string;
  page?: string;
  limit?: string;
}

interface TutorFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  page: number;
  limit: number;
}

/* ================================
   Controllers
================================ */

/**
 * PUT /api/tutor/profile
 */
export const upsertTutorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    const payload = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
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
 * PUT /api/tutor/availability
 */
export const updateAvailabilityController = async (
  req: Request<{}, {}, AvailabilityBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    const { slots } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
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
 * GET /api/tutors
 */
export const getAllTutorsController = async (
  req: Request<{}, {}, {}, TutorQuery>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { search, category, minPrice, maxPrice, rating, page, limit } =
      req.query;

    const filters: TutorFilters = {
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 12,
    };

    if (search) filters.search = search;
    if (category) filters.category = category;
    if (minPrice) filters.minPrice = Number(minPrice);
    if (maxPrice) filters.maxPrice = Number(maxPrice);
    if (rating) filters.rating = Number(rating);

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
 * GET /api/tutors/:id
 */
export const getTutorByIdController = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid tutor ID",
      });
    }

    const tutor = await TutorService.getTutorById(id);

    return res.status(200).json({
      success: true,
      message: "Tutor retrieved successfully",
      data: tutor,
    });
  } catch (err: any) {
    return res.status(404).json({
      success: false,
      message: err?.message || "Tutor not found",
    });
  }
};

/**
 * GET /api/tutor/dashboard
 */
export const getTutorDashboardController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
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
