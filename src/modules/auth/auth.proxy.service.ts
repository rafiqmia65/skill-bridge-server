import type { RequestWithBody, AppResponse } from "../../types/express.js";

const BASE_URL = `${process.env.BACKEND_URL}/api/auth`;

export async function authProxyService(
  req: RequestWithBody,
  res: AppResponse,
  path: string,
): Promise<AppResponse> {
  try {
    const origin = Array.isArray(req.headers.origin)
      ? req.headers.origin[0]
      : req.headers.origin;
    const cookie = Array.isArray(req.headers.cookie)
      ? req.headers.cookie.join("; ")
      : req.headers.cookie;
    const authorization = Array.isArray(req.headers.authorization)
      ? req.headers.authorization[0]
      : req.headers.authorization;

    // --- Fix for exactOptionalPropertyTypes ---
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

    const fetchResponse = await fetch(`${BASE_URL}${path}`, init);

    const setCookie = fetchResponse.headers.get("set-cookie");
    if (setCookie) {
      res.setHeader("Set-Cookie", setCookie);
    }

    const text = await fetchResponse.text();
    let data: Record<string, unknown> = {};
    try {
      data = text ? (JSON.parse(text) as Record<string, unknown>) : {};
    } catch {
      data = { message: text };
    }

    return res.status(fetchResponse.status).json(data);
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
