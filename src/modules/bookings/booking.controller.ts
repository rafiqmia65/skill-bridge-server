import { Request, Response } from "express";
import * as BookingService from "./booking.service";

/**
 * @desc    Create a new booking
 */
export const createBookingController = async (req: Request, res: Response) => {
  const studentId = req.user!.id;
  const payload = req.body;

  const booking = await BookingService.createBooking(studentId, payload);

  res.status(201).json({
    success: true,
    message: "Booking created successfully",
    data: booking,
  });
};

/**
 * @desc    Get logged-in student's bookings
 */
export const getMyBookingsController = async (req: Request, res: Response) => {
  const studentId = req.user!.id;

  const bookings = await BookingService.getMyBookings(studentId);

  res.status(200).json({
    success: true,
    message: "Bookings retrieved successfully",
    data: bookings,
  });
};
