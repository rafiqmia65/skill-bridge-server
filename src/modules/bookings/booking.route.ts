import { Router } from "express";
import { authorize } from "../../middlewares/authorize.js";
import { Role } from "../../constants/role.js";
import {
  createBookingController,
  getAllBookingsController,
  getBookingByIdController,
  getMyBookingsController,
} from "./booking.controller.js";

const bookingRouter = Router();

/**
 * @route   POST /api/bookings
 * @desc    Create a new booking (student books a session with a tutor)
 * @access  Private (Student only)
 */
bookingRouter.post("/", authorize(Role.STUDENT), createBookingController);

/**
 * @route   GET /api/bookings
 * @desc    Get all bookings of logged-in student
 * @access  Private (Student only)
 */
bookingRouter.get("/", authorize(Role.STUDENT), getMyBookingsController);

/**
 * @route   GET /api/bookings/admin
 * @desc    Admin: Get all bookings
 * @access  Private (Admin only)
 */
bookingRouter.get("/admin", authorize(Role.ADMIN), getAllBookingsController);

/**
 * @route   GET /api/bookings/:id
 * @desc    Get a single booking's details
 * @access  Private (Student only)
 */
bookingRouter.get("/:id", authorize(Role.STUDENT), getBookingByIdController);

export default bookingRouter;
