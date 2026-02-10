import { Router, type Router as ExpressRouter } from "express";
import { authorize } from "../../middlewares/authorize";
import { Role } from "../../constants/role";
import { getStudentProfileController } from "./student.controller";

const studentRouter: ExpressRouter = Router();

// Student profile routes
studentRouter.get(
  "/profile",
  authorize(Role.STUDENT),
  getStudentProfileController,
);

export default studentRouter;
