import { Request, Response } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "../../lib/auth";

const BASE_URL = `${process.env.BACKEND_URL}/api/auth`;

// Proxy function for register/login
async function proxy(req: Request, res: Response, path: string) {
  try {
    const init: RequestInit = {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        origin: req.headers.origin ?? process.env.APP_URL ?? "",
        cookie: req.headers.cookie ?? "",
      },
    };

    if (!["GET", "HEAD"].includes(req.method)) {
      init.body = JSON.stringify(req.body);
    }

    const response = await fetch(`${BASE_URL}${path}`, init);

    // Forward Set-Cookie from Better Auth
    const setCookie = response.headers.get("set-cookie");
    if (setCookie) res.setHeader("set-cookie", setCookie);

    const text = await response.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch (e) {
      data = { message: text || null };
    }

    res.status(response.status).json(data);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ code: "PROXY_ERROR", message: err.message });
  }
}

// Routes
export const register = (req: Request, res: Response) =>
  proxy(req, res, "/sign-up/email");

export const login = (req: Request, res: Response) =>
  proxy(req, res, "/sign-in/email");

// GET /me → direct Better Auth session
export const me = (req: Request, res: Response) => {
  const originalUrl = req.url;
  req.url = "/session"; // Better Auth expects /session
  return toNodeHandler(auth)(req, res).finally(() => {
    req.url = originalUrl; // restore
  });
};
