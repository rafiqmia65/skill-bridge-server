import { Router, type Router as ExpressRouter } from "express";
import { authorize } from "../../middlewares/authorize";
import { Role } from "../../constants/role";
import {
  getStudentProfileController,
  updateStudentProfileController,
} from "./student.controller";

const studentRouter = Router();

// PUT update student profile
studentRouter.put(
  "/updateProfile",
  authorize(Role.STUDENT),
  updateStudentProfileController,
);

// GET student profile
studentRouter.get(
  "/profile",
  authorize(Role.STUDENT),
  getStudentProfileController,
);

export default studentRouter;
