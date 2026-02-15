import { Request, Response } from "express";
import { authProxyService } from "./auth.proxy.service.js";
import { auth } from "../../lib/auth.js";

/**
 * Convert Express headers (string | string[] | undefined) into
 * string-to-string mapping suitable for fetch or auth SDK calls.
 */
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
 * POST /api/auth/register
 * Public
 */
export const register = (req: Request, res: Response) => {
  return authProxyService(req, res, "/sign-up/email");
};

/**
 * POST /api/auth/login
 * Public
 */
export const login = (req: Request, res: Response) => {
  return authProxyService(req, res, "/sign-in/email");
};

/**
 * GET /api/auth/me
 * Public
 */
export const me = async (req: Request, res: Response) => {
  try {
    const session = await auth.api.getSession({
      headers: normalizeHeaders(req.headers),
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
      message: error?.message ?? "Unknown error",
    });
  }
};
