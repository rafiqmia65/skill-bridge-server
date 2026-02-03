import { Request, Response } from "express";
import * as AdminService from "./admin.service";

/**
 * @desc Get all users
 */
export const getAllUsersController = async (req: Request, res: Response) => {
  const users = await AdminService.getAllUsers();
  res.status(200).json({
    success: true,
    message: "Users retrieved successfully",
    data: users,
  });
};

/**
 * @desc    Update user status (ban/unban)
 */
export const updateUserStatusController = async (
  req: Request,
  res: Response,
) => {
  const userId = String(req.params.id); // Convert string | undefined to string
  const { status } = req.body; // "ACTIVE" or "BANNED"

  const updatedUser = await AdminService.updateUserStatus(userId, status);

  res.status(200).json({
    success: true,
    message: "User status updated successfully",
    data: updatedUser,
  });
};
