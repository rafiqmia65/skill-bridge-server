import { Request, Response } from "express";
import * as TutorService from "./tutor.service";

// Update tutor profile
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

export const updateAvailabilityController = async (
  req: Request,
  res: Response,
) => {
  const userId = req.user!.id; // USER ID
  const { slots } = req.body;

  const availability = await TutorService.updateAvailability(userId, slots);

  res.status(200).json({
    success: true,
    message: "Availability updated successfully",
    data: availability,
  });
};
