import { Router, type Router as ExpressRouter } from "express";
import { login, me, register } from "./auth.proxy.controller";

const router: ExpressRouter = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", me); // direct Better Auth session

export default router;
