import { Request, Response, NextFunction } from "express";
import * as BookingService from "./booking.service.js";

/**
 * @desc Create a new booking
 * @route POST /api/bookings
 */
export const createBookingController = async (
  req: Request<{}, any, { tutorProfileId: string; date: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = (req as any).user;

    if (!user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { tutorProfileId, date } = req.body;

    if (!tutorProfileId || !date) {
      return res.status(400).json({
        success: false,
        message: "tutorProfileId and date are required",
      });
    }

    const booking = await BookingService.createBooking(user.id, {
      tutorProfileId,
      date,
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Get all bookings of logged-in student
 * @route GET /api/bookings/my
 */
export const getMyBookingsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = (req as any).user;

    if (!user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const bookings = await BookingService.getMyBookings(user.id);

    res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully",
      data: bookings,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Get single booking by ID
 * @route GET /api/bookings/:id
 */
export const getBookingByIdController = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = (req as any).user;

    if (!user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const bookingId = req.params.id;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "Booking ID is required",
      });
    }

    const booking = await BookingService.getBookingById(user.id, bookingId);

    res.status(200).json({
      success: true,
      message: "Booking details retrieved successfully",
      data: booking,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Admin: Get all bookings
 * @route GET /api/bookings
 */
export const getAllBookingsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const bookings = await BookingService.getAllBookings();

    res.status(200).json({
      success: true,
      message: "All bookings retrieved successfully",
      data: bookings,
    });
  } catch (err) {
    next(err);
  }
};
