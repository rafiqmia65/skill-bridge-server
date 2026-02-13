import { Router } from "express";
import { authorize } from "../../middlewares/authorize.js";
import { Role } from "../../constants/role.js";
import {
  getStudentProfileController,
  updateStudentProfileController,
} from "./student.controller.js";

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
