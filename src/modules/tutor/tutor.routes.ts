import { Router, type Router as ExpressRouter } from "express";
import { upsertTutorProfile } from "./tutor.controller";
import { authorize } from "../middlewares/authorize";
import { Role } from "../../constants/role";

const tutorRouter: ExpressRouter = Router();

tutorRouter.put("/profile", authorize(Role.TUTOR), upsertTutorProfile);

export default tutorRouter;
