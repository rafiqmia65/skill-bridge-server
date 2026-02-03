import { Router, type Router as ExpressRouter } from "express";
import { Role } from "../../constants/role";
import {
  getAllUsersController,
  updateUserStatusController,
} from "./admin.controller";
import { authorize } from "../../middlewares/authorize";

const adminRouter: ExpressRouter = Router();

/**
 * @route   GET /api/admin/users
 * @desc    Get all users (students & tutors)
 * @access  Private (Admin)
 */
adminRouter.get("/users", authorize(Role.ADMIN), getAllUsersController);

/**
 * @route   PATCH /api/admin/users/:id
 * @desc    Update user status (banned/unbanned)
 * @access  Private (Admin)
 */
adminRouter.patch(
  "/users/:id",
  authorize(Role.ADMIN),
  updateUserStatusController,
);

export default adminRouter;
