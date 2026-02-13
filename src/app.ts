import express, { Application, Request, Response } from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";

// Import routers
import authProxyRoutes from "./modules/auth/auth.proxy.route.js";
import tutorRouter from "./modules/tutor/tutor.routes.js";
import tutorsRouter from "./modules/tutor/tutors.route.js";
import categoryRouter from "./modules/category/category.route.js";
import bookingRouter from "./modules/bookings/booking.route.js";
import reviewRouter from "./modules/reviews/review.router.js";
import adminRouter from "./modules/admin/admin.router.js";
import studentRouter from "./modules/student/student.router.js";

const app: Application = express();

/**
 * Middleware to parse incoming requests with JSON payloads
 * and URL-encoded payloads (form submissions)
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Enable CORS for frontend app.
 * Allows requests from the specified origin and sends cookies.
 */
app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:3000",
    credentials: true,
  }),
);

/**
 * Authentication proxy routes
 * Handles /api/auth/register, /api/auth/login, and /api/auth/me
 */
app.use("/api/auth", authProxyRoutes);

/**
 * Catch-all route for Better Auth internal endpoints
 * Required for Better Auth to work properly
 */
app.all("/api/auth/*split", toNodeHandler(auth));

/**
 * Tutor-specific routes (Private for logged-in tutors)
 */
app.use("/api/tutor", tutorRouter);

/**
 * Public tutor routes (e.g., browse all tutors, view details)
 */
app.use("/api/tutors", tutorsRouter);

/**
 * Category routes (e.g., get all categories)
 */
app.use("/api/categories", categoryRouter);

/**
 * Booking routes (Students & Tutors)
 */
app.use("/api/bookings", bookingRouter);

/**
 * Review routes (Students)
 */
app.use("/api/reviews", reviewRouter);

/**
 * Admin routes (Admin-only access)
 */
app.use("/api/admin", adminRouter);

/**
 * student routes (student-only access)
 */
app.use("/api/student", studentRouter);

/**
 * Health check route
 * Confirms the server is running and reachable
 */
app.get("/", (req: Request, res: Response) => {
  res.json({
    status: "OK",
    message: "Skill Bridge App is running successfully",
  });
});

export default app;
