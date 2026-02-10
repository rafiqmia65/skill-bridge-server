import { Request, Response } from "express";
import { StudentProfileService } from "./student.service";

/**
 * GET /api/student/profile
 * Access: Private (Student)
 */
export const getStudentProfileController = async (
  req: Request,
  res: Response,
) => {
  try {
    const userId = req.user!.id; // from token

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
