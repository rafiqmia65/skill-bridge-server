import { Request, Response } from "express";
import { StudentProfileService } from "./student.service";

/**
 * GET /api/student/profile
 */
export const getStudentProfileController = async (
  req: Request,
  res: Response,
) => {
  try {
    const userId = req.user!.id; // from auth middleware
    const profile = await StudentProfileService.getProfile(userId);

    res.status(200).json({
      success: true,
      message: "Student profile retrieved successfully",
      data: profile,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to load profile",
    });
  }
};

/**
 * PUT /api/student/profile
 */
export const updateStudentProfileController = async (
  req: Request,
  res: Response,
) => {
  try {
    const userId = req.user!.id;
    const payload = req.body;

    const updatedProfile = await StudentProfileService.updateProfile(
      userId,
      payload,
    );

    res.status(200).json({
      success: true,
      message: "Student profile updated successfully",
      data: updatedProfile,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update profile",
    });
  }
};
