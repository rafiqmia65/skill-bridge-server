import { Request, Response } from "express";
import * as BookingService from "./booking.service";

/**
 * @desc    Handle creating a new booking
 */
export const createBookingController = async (req: Request, res: Response) => {
  const studentId = req.user!.id; // logged-in student
  const payload = req.body;

  const booking = await BookingService.createBooking(studentId, payload);

  res.status(201).json({
    success: true,
    message: "Booking created successfully",
    data: booking,
  });
};

/**
 * @desc    Handle fetching all bookings of the logged-in student
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

/**
 * @desc    Handle fetching a single booking by ID
 */
export const getBookingByIdController = async (req: Request, res: Response) => {
  const studentId = req.user!.id;
  const bookingId = req.params.id;

  // Ensure bookingId is valid
  if (!bookingId || Array.isArray(bookingId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid booking ID",
    });
  }

  const booking = await BookingService.getBookingById(studentId, bookingId);

  res.status(200).json({
    success: true,
    message: "Booking details retrieved successfully",
    data: booking,
  });
};
