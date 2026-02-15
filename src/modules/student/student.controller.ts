import { RequestHandler } from "express";
import { StudentProfileService } from "./student.service.js";

/**
 * GET /api/student/profile
 * Private (Student)
 */
export const getStudentProfileController: RequestHandler = async (
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

    const profile = await StudentProfileService.getProfile(userId);

    return res.status(200).json({
      success: true,
      message: "Student profile retrieved successfully",
      data: profile,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/student/profile
 * Private (Student)
 */
export const updateStudentProfileController: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const userId = req.user?.id;
    const payload = req.body; // you can type this if you have a DTO/interface

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
  } catch (err) {
    next(err);
  }
};
