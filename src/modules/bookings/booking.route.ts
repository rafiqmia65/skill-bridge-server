import { Router, type Router as ExpressRouter } from "express";
import { authorize } from "../middlewares/authorize";
import { Role } from "../../constants/role";
import { createBookingController } from "./booking.controller";

const bookingRouter: ExpressRouter = Router();

/**
 * @route   POST /api/bookings
 * @desc    Create a new booking
 * @access  Private (Student)
 */
bookingRouter.post("/", authorize(Role.STUDENT), createBookingController);

export default bookingRouter;
