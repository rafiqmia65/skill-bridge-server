import { Request, Response, NextFunction } from "express";
import { StudentProfileService } from "./student.service.js";

/**
 * GET /api/student/profile
 * Private (Student)
 */
export const getStudentProfileController = async (
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

    const profile = await StudentProfileService.getProfile(userId);

    return res.status(200).json({
      success: true,
      message: "Student profile retrieved successfully",
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/student/profile
 * Private (Student)
 */
export const updateStudentProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    const payload = req.body; // optionally type this if you have a DTO/interface

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const updatedProfile = await StudentProfileService.updateProfile(
      userId,
      payload,
    );

    return res.status(200).json({
      success: true,
      message: "Student profile updated successfully",
      data: updatedProfile,
    });
  } catch (error) {
    next(error);
  }
};
