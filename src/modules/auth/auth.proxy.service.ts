import type { AppResponse, RequestWithHeaders } from "../../types/express.js";

const BASE_URL = `${process.env.BACKEND_URL}/api/auth`;

/**
 * Proxy request to Better Auth backend
 */
export async function authProxyService(
  req: RequestWithHeaders<any>, // use headers + typed body
  res: AppResponse,
  path: string,
): Promise<void> {
  try {
    // Normalize headers for fetch
    const origin = Array.isArray(req.headers.origin)
      ? req.headers.origin[0]
      : req.headers.origin;
    const cookie = Array.isArray(req.headers.cookie)
      ? req.headers.cookie.join("; ")
      : req.headers.cookie;
    const authorization = Array.isArray(req.headers.authorization)
      ? req.headers.authorization[0]
      : req.headers.authorization;

    // Prepare request body
    let body: BodyInit | null = null;
    if (!["GET", "HEAD"].includes(req.method) && req.body) {
      body = JSON.stringify(req.body);
    }

    const init: RequestInit = {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        origin: origin ?? process.env.APP_URL ?? "",
        cookie: cookie ?? "",
        ...(authorization && { authorization }),
      },
      body,
    };

    // Call the backend
    const fetchResponse = await fetch(`${BASE_URL}${path}`, init);

    // Forward any Set-Cookie header
    const setCookie = fetchResponse.headers.get("set-cookie");
    if (setCookie) {
      res.setHeader("Set-Cookie", setCookie);
    }

    // Parse response body
    const text = await fetchResponse.text();
    let data: Record<string, unknown> = {};
    try {
      data = text ? (JSON.parse(text) as Record<string, unknown>) : {};
    } catch {
      data = { message: text };
    }

    // Respond to client
    res.status(fetchResponse.status).json(data);
  } catch (error: unknown) {
    console.error("AUTH PROXY SERVICE ERROR:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";

    res.status(500).json({
      code: "PROXY_ERROR",
      message: errorMessage,
    });
  }
}
