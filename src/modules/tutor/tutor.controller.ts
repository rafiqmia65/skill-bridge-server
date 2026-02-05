import { Request, Response } from "express";
import * as TutorService from "./tutor.service";

/**
 * @desc    Create or update tutor profile
 * @route   PUT /api/tutor/profile
 * @access  Private (Tutor)
 */
export const upsertTutorProfile = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const payload = req.body;

  const profile = await TutorService.upsertTutorProfile(userId, payload);

  res.status(200).json({
    success: true,
    message: "Tutor profile saved successfully",
    data: profile,
  });
};

/**
 * @desc    Update tutor availability slots
 * @route   PUT /api/tutor/availability
 * @access  Private (Tutor)
 */
export const updateAvailabilityController = async (
  req: Request,
  res: Response,
) => {
  const userId = req.user!.id;
  const { slots } = req.body;

  const availability = await TutorService.updateAvailability(userId, slots);

  res.status(200).json({
    success: true,
    message: "Availability updated successfully",
    data: availability,
  });
};

/**
 * @desc    Get all tutors with optional filters
 * @route   GET /api/tutors
 * @access  Public
 */

export const getAllTutorsController = async (req: Request, res: Response) => {
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
    res
      .status(500)
      .json({ success: false, message: "Something went wrong", error });
  }
};

/**
 * @desc    Get a single tutor by ID
 * @route   GET /api/tutors/:id
 * @access  Public
 */
export const getTutorByIdController = async (req: Request, res: Response) => {
  try {
    const tutorId = req.params.id;
    if (!tutorId || Array.isArray(tutorId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid tutor ID" });
    }

    const tutor = await TutorService.getTutorById(tutorId);

    res.status(200).json({
      success: true,
      message: "Tutor retrieved successfully",
      data: tutor,
    });
  } catch (error: any) {
    res
      .status(404)
      .json({ success: false, message: error.message || "Tutor not found" });
  }
};
