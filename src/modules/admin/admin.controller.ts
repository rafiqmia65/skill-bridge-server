import { Request, Response, NextFunction } from "express";
import * as AdminService from "./admin.service.js";

interface UpdateUserStatusDTO {
  status: "ACTIVE" | "BANNED";
}

/**
 * GET /api/admin/users
 * Private (Admin)
 */
export const getAllUsersController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await AdminService.getAllUsers();

    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/admin/users/:id
 * Private (Admin)
 */
export const updateUserStatusController = async (
  req: Request<{ id: string }, {}, UpdateUserStatusDTO>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.params.id;
    const { status } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const updatedUser = await AdminService.updateUserStatus(userId, status);

    return res.status(200).json({
      success: true,
      message: "User status updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};
