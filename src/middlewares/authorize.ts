import { NextFunction } from "express";
import { auth } from "../lib/auth.js";
import { AppResponse, RequestWithUser } from "../types/express.js";

type Role = "ADMIN" | "TUTOR" | "STUDENT";

/**
 * Universal authorize middleware
 */
export const authorize =
  (...allowedRoles: Role[]) =>
  async (
    req: RequestWithUser,
    res: AppResponse,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // Get session from headers (Postman) or cookies (browser)
      const session = await auth.api.getSession({
        headers: req.headers as any, // pass cookies or auth headers
      });

      if (!session || !session.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      // attach user to request
      req.user = session.user as any; // typecast to our user type

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
      return;
    }
  };
