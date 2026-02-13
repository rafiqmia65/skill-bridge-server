import { AppResponse, RequestWithUser } from "../../types/express.js";
import * as BookingService from "./booking.service.js";

/**
 * @desc Create a new booking
 * @route POST /api/bookings
 */
export const createBookingController = async (
  req: RequestWithUser<{ tutorProfileId: string; date: string }>,
  res: AppResponse,
) => {
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
 * @route GET /api/bookings/my
 */
export const getMyBookingsController = async (
  req: RequestWithUser,
  res: AppResponse,
) => {
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
 * @route GET /api/bookings/:id
 */
export const getBookingByIdController = async (
  req: RequestWithUser<any, { id: string }>,
  res: AppResponse,
) => {
  try {
    const studentId = req.user!.id;
    const bookingId = req.params.id;

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
 * @route GET /api/bookings
 */
export const getAllBookingsController = async (
  req: RequestWithUser,
  res: AppResponse,
) => {
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
