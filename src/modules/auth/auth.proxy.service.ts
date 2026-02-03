import { Request, Response } from "express";

/**
 * Base URL for the backend Better Auth API
 */
const BASE_URL = `${process.env.BACKEND_URL}/api/auth`;

/**
 * @desc    Generic proxy service to forward requests to Better Auth backend
 * @param   req - Express request object
 * @param   res - Express response object
 * @param   path - Backend API path (e.g., /sign-up/email)
 */
export async function authProxyService(
  req: Request,
  res: Response,
  path: string,
) {
  try {
    const init: RequestInit = {
      method: req.method,
      headers: {
        "Content-Type": "application/json",

        // Required by Better Auth for CORS
        origin: req.headers.origin ?? process.env.APP_URL ?? "",

        // Forward session cookies
        cookie: req.headers.cookie ?? "",
      },
    };

    // Include body for non-GET/HEAD requests
    if (!["GET", "HEAD"].includes(req.method)) {
      init.body = JSON.stringify(req.body);
    }

    // Forward the request to Better Auth backend
    const response = await fetch(`${BASE_URL}${path}`, init);

    // Forward "set-cookie" headers if backend sets a session cookie
    const setCookie = response.headers.get("set-cookie");
    if (setCookie) {
      res.setHeader("set-cookie", setCookie);
    }

    // Parse the response safely
    const text = await response.text();
    let data: any;

    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { message: text || null };
    }

    return res.status(response.status).json(data);
  } catch (error: any) {
    console.error("AUTH PROXY SERVICE ERROR:", error);
    return res.status(500).json({
      code: "PROXY_ERROR",
      message: error.message,
    });
  }
}
