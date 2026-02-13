import { AppResponse, RequestWithHeaders } from "../../types/express.js";
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
 * @desc    Proxy register request to Better Auth
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = (req: RequestWithHeaders, res: AppResponse) => {
  // Cast to `any` for authProxyService if it expects a RequestWithBody
  return authProxyService(req as any, res, "/sign-up/email");
};

/**
 * @desc    Proxy login request to Better Auth
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = (req: RequestWithHeaders, res: AppResponse) => {
  return authProxyService(req as any, res, "/sign-in/email");
};

/**
 * @desc    Retrieve current session information
 * @route   GET /api/auth/me
 * @access  Public
 */
export const me = async (req: RequestWithHeaders, res: AppResponse) => {
  try {
    const session = await auth.api.getSession({
      headers: normalizeHeaders(req.headers), // pass string-only headers
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
