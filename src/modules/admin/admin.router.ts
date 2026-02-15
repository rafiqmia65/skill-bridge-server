import express from "express";
import { authorize } from "../../middlewares/authorize.js";
import { Role } from "../../constants/role.js";
import {
  getAllUsersController,
  updateUserStatusController,
} from "./admin.controller.js";

const adminRouter: ReturnType<typeof express.Router> = express.Router();

/**
 * @route   GET /api/admin/users
 * @desc    Get all users (students & tutors)
 * @access  Private (Admin)
 */
adminRouter.get("/users", authorize(Role.ADMIN), getAllUsersController);

/**
 * @route   PATCH /api/admin/users/:id
 * @desc    Update user status (ban/unban)
 * @access  Private (Admin)
 */
adminRouter.patch(
  "/users/:id",
  authorize(Role.ADMIN),
  updateUserStatusController,
);

export default adminRouter;
