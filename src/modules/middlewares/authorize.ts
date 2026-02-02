import { Request, Response, NextFunction } from "express";
import { auth } from "../../lib/auth";

type Role = "ADMIN" | "TUTOR" | "STUDENT";

/**
 * Universal authorize middleware
 * Works for frontend (cookie) or Postman (header)
 */
export const authorize =
  (...allowedRoles: Role[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 1️⃣ Get session from headers (Postman) or cookies (browser)
      const session = await auth.api.getSession({
        headers: req.headers as any, // pass cookies or auth headers
      });

      if (!session || !session.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // attach user to request
      req.user = session.user;

      // 2️⃣ Check allowed roles
      if (!allowedRoles.includes(req.user.role)) {
        return res
          .status(403)
          .json({ message: "Forbidden: insufficient permissions" });
      }

      // 3️⃣ Everything ok
      next();
    } catch (error) {
      console.error("Authorize middleware error:", error);
      return res.status(401).json({ message: "Unauthorized" });
    }
  };
