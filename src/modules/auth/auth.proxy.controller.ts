import type { Response } from "express";
import { authProxyService } from "./auth.proxy.service.js";
import { auth } from "../../lib/auth.js";
import { RequestWithHeaders } from "../../../types/express.js";

function normalizeHeaders(
  headers: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key in headers) {
    const value = headers[key];
    if (!value) continue;
    result[key] = Array.isArray(value) ? value.join("; ") : value;
  }
  return result;
}

/**
 * @desc    Proxy register request to Better Auth
 * @route   POST /api/auth/register
 */
export const register = (req: RequestWithHeaders, res: Response) => {
  return authProxyService(req, res, "/sign-up/email");
};

/**
 * @desc    Proxy login request to Better Auth
 * @route   POST /api/auth/login
 */
export const login = (req: RequestWithHeaders, res: Response) => {
  return authProxyService(req, res, "/sign-in/email");
};

/**
 * @desc    Retrieve current session information
 * @route   GET /api/auth/me
 */
export const me = async (req: RequestWithHeaders, res: Response) => {
  try {
    const session = await auth.api.getSession({
      headers: normalizeHeaders(req.headers), // <-- now type-safe
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
