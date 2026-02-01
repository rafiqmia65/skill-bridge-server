import { Request, Response } from "express";
import { authProxyService } from "./auth.proxy.service";
import { auth } from "../../lib/auth";

// POST /api/auth/register
export const register = (req: Request, res: Response) => {
  return authProxyService(req, res, "/sign-up/email");
};

// POST /api/auth/login
export const login = (req: Request, res: Response) => {
  return authProxyService(req, res, "/sign-in/email");
};

// GET /api/auth/me → session return
export const me = async (req: Request, res: Response) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers as any, // cookie from request
    });

    if (!session) {
      return res.status(401).json({
        authenticated: false,
        session: null,
      });
    }

    return res.status(200).json({
      authenticated: true,
      session,
    });
  } catch (error: any) {
    console.error("GET SESSION ERROR:", error);
    return res.status(500).json({
      code: "SESSION_ERROR",
      message: error.message,
    });
  }
};
