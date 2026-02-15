import { RequestHandler } from "express";
import * as TutorService from "./tutor.service.js";

/**
 * PUT /api/tutor/profile
 */
export const upsertTutorProfile: RequestHandler = async (req, res, next) => {
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
export const updateAvailabilityController: RequestHandler = async (
  req,
  res,
  next,
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
export const getAllTutorsController: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const { search, category, minPrice, maxPrice, rating, page, limit } =
      req.query as any;

    const filters = {
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 12,
      search: search as string,
      category: category as string,
      minPrice: Number(minPrice),
      maxPrice: Number(maxPrice),
      rating: Number(rating),
    };

    const result = await TutorService.getAllTutors(filters as any);

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
export const getTutorByIdController: RequestHandler<{ id: string }> = async (
  req,
  res,
  next,
) => {
  try {
    const { id } = req.params;

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
export const getTutorDashboardController: RequestHandler = async (
  req,
  res,
  next,
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
