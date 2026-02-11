import type {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";

/**
 * Better Auth backend base URL
 * example: https://your-backend.vercel.app
 */
const BASE_URL = `${process.env.BACKEND_URL}/api/auth`;

type FetchRequestInit = globalThis.RequestInit;

export async function authProxyService(
  req: ExpressRequest,
  res: ExpressResponse,
  path: string,
) {
  try {
    const init: FetchRequestInit = {
      method: req.method,
      headers: {
        "Content-Type": "application/json",

        // required for CORS + cookies
        origin: req.headers.origin ?? process.env.APP_URL ?? "",

        // forward cookies to Better Auth
        cookie: req.headers.cookie ?? "",
      },
    };

    // attach body for non-GET requests
    if (!["GET", "HEAD"].includes(req.method)) {
      init.body = JSON.stringify(req.body);
    }

    const response = await fetch(`${BASE_URL}${path}`, init);

    // forward session cookie back to browser
    const setCookie = response.headers.get("set-cookie");
    if (setCookie) {
      res.setHeader("set-cookie", setCookie);
    }

    // safely parse response
    const text = await response.text();
    let data: any = {};

    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { message: text };
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
