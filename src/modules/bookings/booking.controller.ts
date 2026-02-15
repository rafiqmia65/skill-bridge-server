import { RequestHandler } from "express";
import * as BookingService from "./booking.service.js";

interface CreateBookingDTO {
  tutorProfileId: string;
  date: string;
}

/**
 * POST /api/bookings
 * Private (Student)
 */
export const createBookingController: RequestHandler<
  {},
  {},
  CreateBookingDTO
> = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { tutorProfileId, date } = req.body;
    if (!tutorProfileId || !date) {
      return res.status(400).json({
        success: false,
        message: "tutorProfileId and date are required",
      });
    }

    const booking = await BookingService.createBooking(userId, {
      tutorProfileId,
      date,
    });

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/bookings
 * Private (Student)
 */
export const getMyBookingsController: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const bookings = await BookingService.getMyBookings(userId);

    return res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully",
      data: bookings,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/bookings/:id
 * Private (Student)
 */
export const getBookingByIdController: RequestHandler<{ id: string }> = async (
  req,
  res,
  next,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const bookingId = req.params.id;
    if (!bookingId) {
      return res
        .status(400)
        .json({ success: false, message: "Booking ID is required" });
    }

    const booking = await BookingService.getBookingById(userId, bookingId);

    return res.status(200).json({
      success: true,
      message: "Booking details retrieved successfully",
      data: booking,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/bookings/admin
 * Private (Admin)
 */
export const getAllBookingsController: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const bookings = await BookingService.getAllBookings();

    return res.status(200).json({
      success: true,
      message: "All bookings retrieved successfully",
      data: bookings,
    });
  } catch (err) {
    next(err);
  }
};
