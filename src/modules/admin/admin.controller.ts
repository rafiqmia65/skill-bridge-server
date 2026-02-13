import { AppResponse, RequestWithBodyAndParams } from "../../types/express.js";
import * as AdminService from "./admin.service.js";

export const getAllUsersController = async (
  req: RequestWithBodyAndParams<{}, {}>,
  res: AppResponse,
) => {
  const users = await AdminService.getAllUsers();
  res.status(200).json({
    success: true,
    message: "Users retrieved successfully",
    data: users,
  });
};

export const updateUserStatusController = async (
  req: RequestWithBodyAndParams<
    { status: "ACTIVE" | "BANNED" },
    { id: string }
  >,
  res: AppResponse,
) => {
  const userId = req.params.id;
  const { status } = req.body;

  const updatedUser = await AdminService.updateUserStatus(userId, status);

  res.status(200).json({
    success: true,
    message: "User status updated successfully",
    data: updatedUser,
  });
};
