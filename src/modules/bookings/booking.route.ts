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
 * @desc    Create a new booking
 * @access  Private (Student)
 */
bookingRouter.post("/", authorize(Role.STUDENT), createBookingController);

/**
 * @route   GET /api/bookings
 * @desc    Get logged-in student's bookings
 * @access  Private (Student)
 */
bookingRouter.get("/", authorize(Role.STUDENT), getMyBookingsController);

/**
 * @route   GET /api/bookings/:id
 * @desc    Get logged-in student's Single booking
 * @access  Private (Student)
 */
bookingRouter.get("/:id", authorize(Role.STUDENT), getBookingByIdController);

export default bookingRouter;
