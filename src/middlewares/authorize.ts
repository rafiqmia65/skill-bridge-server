import { RequestHandler } from "express";
import { auth } from "../lib/auth.js";

type Role = "ADMIN" | "TUTOR" | "STUDENT";

/**
 * Middleware to authorize users based on roles
 */
export const authorize = (...allowedRoles: Role[]): RequestHandler => {
  return async (req, res, next) => {
    try {
      // Convert headers to string-only record for Better-Auth
      const headers: Record<string, string> = {};
      for (const key in req.headers) {
        const value = req.headers[key];
        if (typeof value === "string") {
          headers[key] = value;
        } else if (Array.isArray(value)) {
          headers[key] = value.join(", ");
        }
      }

      // Get current session
      const session = await auth.api.getSession({ headers });

      if (!session?.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Attach user data to request object
      const { id, role, ...rest } = session.user;

      if (!id || !role) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      req.user = {
        id,
        role: role as Role,
        ...rest,
      };

      // Role check
      if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          message: "Forbidden: insufficient permissions",
        });
      }

      return next();
    } catch (error) {
      console.error("Authorize middleware error:", error);
      return res.status(401).json({ message: "Unauthorized" });
    }
  };
};
