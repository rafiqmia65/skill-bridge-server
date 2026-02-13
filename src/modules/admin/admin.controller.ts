import { Request, Response } from "express";
import {
  AppResponse,
  RequestWithBodyAndParams,
} from "../../../types/express.js";
import * as AdminService from "./admin.service.js";

/**
 * @desc Get all users
 */
export const getAllUsersController = async (
  req: Request<{}, {}, {}, {}>, // no params, no body, no query
  res: AppResponse,
) => {
  const users = await AdminService.getAllUsers();
  res.status(200).json({
    success: true,
    message: "Users retrieved successfully",
    data: users,
  });
};

/**
 * @desc Update user status (ban/unban)
 */
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
