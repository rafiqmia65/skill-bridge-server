import { Request, Response } from "express";

const BASE_URL = `${process.env.BACKEND_URL}/api/auth`;

export async function authProxyService(
  req: Request,
  res: Response,
  path: string,
): Promise<void> {
  try {
    // Normalize headers
    const origin = Array.isArray(req.headers.origin)
      ? req.headers.origin[0]
      : req.headers.origin;
    const cookie = Array.isArray(req.headers.cookie)
      ? req.headers.cookie.join("; ")
      : req.headers.cookie;
    const authorization = Array.isArray(req.headers.authorization)
      ? req.headers.authorization[0]
      : req.headers.authorization;

    // Prepare request headers
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      origin: origin ?? process.env.APP_URL ?? "",
      cookie: cookie ?? "",
      ...(authorization && { authorization }),
    };

    // Build RequestInit object
    const init: RequestInit = {
      method: req.method,
      headers,
      // Only include body for methods that support it
      ...(req.method !== "GET" && req.method !== "HEAD" && req.body
        ? { body: JSON.stringify(req.body) }
        : {}),
    };

    // Call backend
    const fetchResponse = await fetch(`${BASE_URL}${path}`, init);

    // Forward Set-Cookie header if present
    const setCookie = fetchResponse.headers.get("set-cookie");
    if (setCookie) {
      res.setHeader("Set-Cookie", setCookie);
    }

    // Parse response body safely
    const text = await fetchResponse.text();
    let data: Record<string, unknown> = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { message: text };
    }

    res.status(fetchResponse.status).json(data);
  } catch (error: unknown) {
    console.error("AUTH PROXY SERVICE ERROR:", error);

    res.status(500).json({
      code: "PROXY_ERROR",
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
}
