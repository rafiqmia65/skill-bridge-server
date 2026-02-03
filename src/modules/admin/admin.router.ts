import { Router, type Router as ExpressRouter } from "express";
import { Role } from "../../constants/role";
import { getAllUsersController } from "./admin.controller";
import { authorize } from "../../middlewares/authorize";

const adminRouter: ExpressRouter = Router();

/**
 * @route   GET /api/admin/users
 * @desc    Get all users (students & tutors)
 * @access  Private (Admin)
 */
adminRouter.get("/users", authorize(Role.ADMIN), getAllUsersController);

export default adminRouter;
