import { Request, Response } from "express";
import * as TutorService from "./tutor.service";

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
