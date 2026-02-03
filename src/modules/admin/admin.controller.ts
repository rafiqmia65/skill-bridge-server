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
