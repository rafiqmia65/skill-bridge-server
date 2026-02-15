import { Request, Response, NextFunction, RequestHandler } from "express";
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
export const upsertTutorProfile: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const payload = req.body;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const profile = await TutorService.upsertTutorProfile(userId, payload);

    res.status(200).json({
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
export const updateAvailabilityController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const { slots } = req.body as AvailabilityBody;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const availability = await TutorService.updateAvailability(userId, slots);

    res.status(200).json({
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
export const getAllTutorsController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const query = req.query as unknown as TutorQuery;
    const { search, category, minPrice, maxPrice, rating, page, limit } = query;

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

    res.status(200).json({
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
export const getTutorByIdController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        message: "Invalid tutor ID",
      });
      return;
    }

    const tutor = await TutorService.getTutorById(id as string);

    res.status(200).json({
      success: true,
      message: "Tutor retrieved successfully",
      data: tutor,
    });
  } catch (err: any) {
    res.status(404).json({
      success: false,
      message: err?.message || "Tutor not found",
    });
  }
};

/**
 * GET /api/tutor/dashboard
 */
export const getTutorDashboardController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const dashboardData = await TutorService.getTutorDashboard(userId);

    res.status(200).json({
      success: true,
      message: "Dashboard data retrieved",
      data: dashboardData,
    });
  } catch (err) {
    next(err);
  }
};
