import { RequestHandler } from "express";
import { authProxyService } from "./auth.proxy.service.js";
import { auth } from "../../lib/auth.js";

/**
 * Convert Express headers into a string-to-string mapping suitable for fetch or SDK calls
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
 */
export const register: RequestHandler = (req, res, next) => {
  // authProxyService 'any'
  return (authProxyService("/sign-up/email") as any)(req, res, next);
};

/**
 * POST /api/auth/login
 */
export const login: RequestHandler = (req, res, next) => {
  return (authProxyService("/sign-in/email") as any)(req, res, next);
};

/**
 * GET /api/auth/me
 */
export const me: RequestHandler = (async (
  req: any,
  res: any,
  next: any,
): Promise<any> => {
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
}) as RequestHandler;
