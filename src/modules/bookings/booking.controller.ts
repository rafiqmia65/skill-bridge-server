import { Request, Response } from "express";
import * as BookingService from "./booking.service";

/**
 * @desc Create a new booking
 */
export const createBookingController = async (req: Request, res: Response) => {
  try {
    const studentId = req.user!.id;
    const { tutorProfileId, date } = req.body;

    if (!tutorProfileId || !date) {
      return res.status(400).json({
        success: false,
        message: "tutorProfileId and date are required",
      });
    }

    const booking = await BookingService.createBooking(studentId, {
      tutorProfileId,
      date,
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * @desc Get all bookings of logged-in student
 */
export const getMyBookingsController = async (req: Request, res: Response) => {
  try {
    const studentId = req.user!.id;
    const bookings = await BookingService.getMyBookings(studentId);

    res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully",
      data: bookings,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc Get single booking by ID
 */
export const getBookingByIdController = async (req: Request, res: Response) => {
  try {
    const studentId = req.user!.id;
    const bookingId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    if (!bookingId) {
      return res
        .status(400)
        .json({ success: false, message: "Booking ID is required" });
    }

    const booking = await BookingService.getBookingById(studentId, bookingId);

    res.status(200).json({
      success: true,
      message: "Booking details retrieved successfully",
      data: booking,
    });
  } catch (err: any) {
    res.status(404).json({ success: false, message: err.message });
  }
};

/**
 * @desc Admin: Get all bookings
 */
export const getAllBookingsController = async (req: Request, res: Response) => {
  try {
    const bookings = await BookingService.getAllBookings();
    res.status(200).json({
      success: true,
      message: "All bookings retrieved successfully",
      data: bookings,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
