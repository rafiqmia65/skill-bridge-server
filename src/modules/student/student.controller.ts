import { AppResponse, RequestWithUser } from "../../types/express.js";
import { StudentProfileService } from "./student.service.js";

export const getStudentProfileController = async (
  req: RequestWithUser,
  res: AppResponse,
) => {
  const userId = req.user!.id;
  const profile = await StudentProfileService.getProfile(userId);

  res.status(200).json({
    success: true,
    message: "Student profile retrieved successfully",
    data: profile,
  });
};

export const updateStudentProfileController = async (
  req: RequestWithUser<any>,
  res: AppResponse,
) => {
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
};
