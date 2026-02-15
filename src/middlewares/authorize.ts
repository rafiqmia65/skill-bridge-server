import { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth.js";

type Role = "ADMIN" | "TUTOR" | "STUDENT";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: Role;
    [key: string]: any;
  };
}

/**
 * Middleware to authorize users based on roles
 */
export const authorize =
  (...allowedRoles: Role[]) =>
  async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // Convert headers to string-only record
      const headers: Record<string, string> = {};
      for (const key in req.headers) {
        const value = req.headers[key];
        if (typeof value === "string") {
          headers[key] = value;
        }
      }

      // Get current session
      const session = await auth.api.getSession({ headers });

      if (!session?.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      // Attach user to request
      // Only pick necessary fields and typecast properly
      const { id, role, ...rest } = session.user;
      if (!id || !role) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      req.user = {
        id,
        role: role as Role,
        ...rest,
      };

      // Role check
      if (!allowedRoles.includes(req.user.role)) {
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
