import { Router, type Router as ExpressRouter } from "express";
import { Role } from "../../constants/role";
import { authorize } from "../../middlewares/authorize";
import {
  getAllUsersController,
  updateUserStatusController,
} from "./admin.controller";

const adminRouter: ExpressRouter = Router();

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
