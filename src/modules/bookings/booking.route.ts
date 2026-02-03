import { Router, type Router as ExpressRouter } from "express";
import { authorize } from "../../middlewares/authorize";
import { Role } from "../../constants/role";
import {
  createBookingController,
  getBookingByIdController,
  getMyBookingsController,
} from "./booking.controller";

const bookingRouter: ExpressRouter = Router();

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
 * @route   GET /api/bookings/:id
 * @desc    Get a single booking's details
 * @access  Private (Student only)
 */
bookingRouter.get("/:id", authorize(Role.STUDENT), getBookingByIdController);

export default bookingRouter;
