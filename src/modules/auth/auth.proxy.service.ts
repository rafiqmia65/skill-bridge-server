import { RequestHandler } from "express";

const BASE_URL = `${process.env.BACKEND_URL}/api/auth`;

export const authProxyService = (path: string): RequestHandler => {
  // @ts-ignore - Express RequestHandler typing conflict bypass
  return async (req: any, res: any, next: any) => {
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

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        origin: origin ?? process.env.APP_URL ?? "",
        ...(cookie ? { cookie } : {}),
        ...(authorization ? { authorization } : {}),
      };

      const init: RequestInit = {
        method: req.method,
        headers,
        ...(req.method !== "GET" && req.method !== "HEAD" && req.body
          ? { body: JSON.stringify(req.body) }
          : {}),
      };

      // fetchResponse
      const fetchResponse = (await fetch(`${BASE_URL}${path}`, init)) as any;

      const setCookie = fetchResponse.headers.get("set-cookie");
      if (setCookie) {
        res.setHeader("Set-Cookie", setCookie);
      }

      const text = await fetchResponse.text();
      let data: Record<string, unknown> = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = { message: text };
      }

      return res.status(fetchResponse.status).json(data);
    } catch (error: unknown) {
      console.error("AUTH PROXY SERVICE ERROR:", error);
      return res.status(500).json({
        code: "PROXY_ERROR",
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  };
};
