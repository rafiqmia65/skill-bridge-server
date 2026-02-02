import { Request, Response } from "express";
import * as TutorService from "./tutor.service";

/**
 * @desc    Create or update tutor profile
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
 * @desc    Get all tutors (Public)
 */
export const getAllTutorsController = async (req: Request, res: Response) => {
  const filters = req.query;

  const tutors = await TutorService.getAllTutors(filters);

  res.status(200).json({
    success: true,
    message: "Tutors retrieved successfully",
    data: tutors,
  });
};
