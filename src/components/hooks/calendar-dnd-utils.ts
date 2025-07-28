import { BookingInstance } from "@/lib/types";
import { format } from "date-fns";

/**
 * Return formatted date string (MM-dd) for a given booking
 */
export const formatBookingDate = (booking: BookingInstance): string => {
    const date = booking.type === "start" ? booking.startDate : booking.endDate;
    return format(new Date(date), "MM-dd");
};

/**
 * Get the container ID (MM-dd) for a given booking ID like "32-start"
 */
export const findContainer = (
    id: string,
    bookings: BookingInstance[],
): string | undefined => {
    const [bookingId, type] = id.split("-");
    const match = bookings.find((b) => b.id === bookingId && b.type === type);
    return match ? formatBookingDate(match) : undefined;
};

/**
 * Get a booking instance from its composed ID "id-type"
 */
export const getBookingInstance = (
    id: string,
    bookings: BookingInstance[],
): BookingInstance | undefined => {
    const [bookingId, type] = id.split("-");
    return bookings.find((b) => b.id === bookingId && b.type === type);
};

/**
 * Get all bookings that match a given day
 */
export const bookingsForDay = (
    day: Date,
    all: BookingInstance[],
): BookingInstance[] => {
    const target = format(day, "MM-dd");
    return all.filter((b) => formatBookingDate(b) === target);
};

/**
 * Check if a booking is currently active
 */
export const isOverFcn = (
    id: string,
    overId: string | null,
    bookings: BookingInstance[],
) => {
    if (!overId) return false;
    if (/^\d{2}-\d{2}$/.test(overId)) return overId === id;

    const [bookingId, type] = overId.split("-");
    const match = bookings.find((b) => b.id === bookingId && b.type === type);
    if (!match) return false;
    const date = type === "start" ? match.startDate : match.endDate;
    return format(new Date(date), "MM-dd") === id;
};
