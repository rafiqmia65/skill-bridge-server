import express from "express";
import { login, me, register } from "./auth.proxy.controller.js";

const authProxyRouter: ReturnType<typeof express.Router> = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Proxy request to Better Auth to register a new user
 * @access  Public
 */
authProxyRouter.post("/register", register);

/**
 * @route   POST /api/auth/login
 * @desc    Proxy request to Better Auth to login a user
 * @access  Public
 */
authProxyRouter.post("/login", login);

/**
 * @route   GET /api/auth/me
 * @desc    Get the current session info from Better Auth
 * @access  Public (requires valid session cookie)
 */
authProxyRouter.get("/me", me);

export default authProxyRouter;
