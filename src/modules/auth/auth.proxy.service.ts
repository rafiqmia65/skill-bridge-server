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
): Promise<ExpressResponse> {
  try {
    const init: FetchRequestInit = {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        origin: req.headers.origin ?? process.env.APP_URL ?? "",
        cookie: req.headers.cookie ?? "",
        // optional: authorization header forward
        ...(req.headers.authorization && {
          authorization: req.headers.authorization,
        }),
      },
    };

    // attach body for non-GET requests
    if (!["GET", "HEAD"].includes(req.method)) {
      init.body = JSON.stringify(req.body);
    }

    const response: globalThis.Response = await fetch(`${BASE_URL}${path}`, init);

    // forward session cookie back to browser
    const setCookie = response.headers.get("set-cookie");
    if (setCookie) {
      res.setHeader("Set-Cookie", setCookie);
    }

    // safely parse response - NO 'any' type
    const text = await response.text();
    let data: Record<string, unknown> = {};

    try {
      data = text ? (JSON.parse(text) as Record<string, unknown>) : {};
    } catch {
      data = { message: text };
    }

    return res.status(response.status).json(data);
  } catch (error: unknown) {
    console.error("AUTH PROXY SERVICE ERROR:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";

    return res.status(500).json({
      code: "PROXY_ERROR",
      message: errorMessage,
    });
  }
}
