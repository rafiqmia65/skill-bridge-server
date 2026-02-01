import { Request, Response } from "express";

const BASE_URL = `${process.env.BACKEND_URL}/api/auth`;

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

        // Better Auth requires origin
        origin: req.headers.origin ?? process.env.APP_URL ?? "",

        // session cookie forward
        cookie: req.headers.cookie ?? "",
      },
    };

    if (!["GET", "HEAD"].includes(req.method)) {
      init.body = JSON.stringify(req.body);
    }

    const response = await fetch(`${BASE_URL}${path}`, init);

    // VERY IMPORTANT: forward set-cookie
    const setCookie = response.headers.get("set-cookie");
    if (setCookie) {
      res.setHeader("set-cookie", setCookie);
    }

    // safe response parsing
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
