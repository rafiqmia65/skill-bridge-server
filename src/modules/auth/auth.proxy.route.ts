import { Router, type Router as ExpressRouter } from "express";
import { register, login, me } from "./auth.proxy.controller";

const router: ExpressRouter = Router();

// proxy → Better Auth
router.post("/register", register);
router.post("/login", login);

// session
router.get("/me", me);

export default router;
