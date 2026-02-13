import express from "express";
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

/**
 * Quick fix for TS + Express 5:
 * Declare app as `any` to satisfy TypeScript
 * This prevents 'Property use/get/all does not exist' errors
 */
const app: any = express();

/**
 * Middleware to parse incoming requests
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Enable CORS
 */
app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:3000",
    credentials: true,
  }),
);

/**
 * Authentication proxy routes
 */
app.use("/api/auth", authProxyRoutes);

/**
 * Catch-all route for Better Auth internal endpoints
 */
app.all("/api/auth/*split", toNodeHandler(auth));

/**
 * Tutor-specific routes
 */
app.use("/api/tutor", tutorRouter);

/**
 * Public tutor routes
 */
app.use("/api/tutors", tutorsRouter);

/**
 * Category routes
 */
app.use("/api/categories", categoryRouter);

/**
 * Booking routes
 */
app.use("/api/bookings", bookingRouter);

/**
 * Review routes
 */
app.use("/api/reviews", reviewRouter);

/**
 * Admin routes
 */
app.use("/api/admin", adminRouter);

/**
 * Student routes
 */
app.use("/api/student", studentRouter);

/**
 * Health check route
 */
app.get("/", (req: any, res: any) => {
  res.status(200).json({
    status: "OK",
    message: "Skill Bridge App is running successfully",
  });
});

export default app;
