import { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth.js";

type Role = "ADMIN" | "TUTOR" | "STUDENT";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: Role;
    [key: string]: any;
  };
}

export const authorize =
  (...allowedRoles: Role[]) =>
  async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const stringHeaders: Record<string, string> = {};

      for (const key in req.headers) {
        const value = req.headers[key];
        if (typeof value === "string") {
          stringHeaders[key] = value;
        }
      }

      const session = await auth.api.getSession({
        headers: stringHeaders,
      });

      if (!session?.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      // Attach user
      req.user = session.user as any;

      // Use session.user instead of req.user for role check
      if (!allowedRoles.includes(session.user.role as Role)) {
        res
          .status(403)
          .json({ message: "Forbidden: insufficient permissions" });
        return;
      }

      next();
    } catch (error) {
      console.error("Authorize middleware error:", error);
      res.status(401).json({ message: "Unauthorized" });
    }
  };
