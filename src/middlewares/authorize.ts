import { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth.js";

type Role = "ADMIN" | "TUTOR" | "STUDENT";

/**
 * Universal authorize middleware
 * Works for frontend (cookie) or Postman (header)
 */
export const authorize =
  (...allowedRoles: Role[]) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Get session from headers (Postman) or cookies (browser)
      const session = await auth.api.getSession({
        headers: req.headers as any, // pass cookies or auth headers
      });

      if (!session || !session.user) {
        res.status(401).json({ message: "Unauthorized" });
        return; // Make sure to return after sending response
      }

      // attach user to request - now properly typed
      req.user = session.user;

      // Check allowed roles
      if (!req.user || !allowedRoles.includes(req.user.role as Role)) {
        res
          .status(403)
          .json({ message: "Forbidden: insufficient permissions" });
        return;
      }

      // Everything ok
      next();
    } catch (error) {
      console.error("Authorize middleware error:", error);
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
  };
