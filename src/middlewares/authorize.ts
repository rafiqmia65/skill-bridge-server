import { NextFunction } from "express";
import { auth } from "../lib/auth.js";
import { AppResponse, RequestWithUser } from "../types/express.js";

type Role = "ADMIN" | "TUTOR" | "STUDENT";

/**
 * AuthRequest: Request that has both `user` and `headers`
 */
export interface AuthRequest<TBody = any> extends RequestWithUser<TBody> {
  headers: Record<string, string | string[] | undefined>;
}

/**
 * Universal authorize middleware
 */
export const authorize =
  (...allowedRoles: Role[]) =>
  async (
    req: AuthRequest, // <-- Use the unified type
    res: AppResponse,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // Get session from headers (Postman) or cookies (browser)
      const session = await auth.api.getSession({
        headers: req.headers as Record<string, string>, // convert to string-only for SDK
      });

      if (!session || !session.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      // Attach user to request
      req.user = session.user as any;

      // Check allowed roles
      if (!req.user || !allowedRoles.includes(req.user.role as Role)) {
        res
          .status(403)
          .json({ message: "Forbidden: insufficient permissions" });
        return;
      }

      // Everything ok
      next();
    } catch (error: any) {
      console.error("Authorize middleware error:", error);
      res.status(401).json({ message: "Unauthorized" });
    }
  };
