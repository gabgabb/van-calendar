import { format } from "date-fns";
import { BookingInstance } from "@/lib/types";
import React, { useState } from "react";
import BookingDialog from "./BookingDialog";
import BookingCard from "./BookingCard";

type Props = {
    day: Date;
    bookings: BookingInstance[];
};

const CalendarDay: React.FC<Props> = ({ day, bookings }) => {
    const [selectedBooking, setSelectedBooking] =
        useState<BookingInstance | null>(null);

    const handleClick = (booking: BookingInstance) =>
        setSelectedBooking(booking);
    const hasBookings = bookings.length > 0;

    return (
        <div
            className={`transition-color h-40 rounded-md border shadow-sm transition-shadow ${
                hasBookings
                    ? "bg-card hover:bg-card/80 text-green-800 transition-colors hover:shadow-lg"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
        >
            <div className="border-border hover:border-border text-secondary bg-card-foreground/80 rounded-t-md border-b p-1 text-center font-semibold">
                {format(day, "EEEE dd MMM")}
            </div>

            {hasBookings ? (
                <div className="scrollbar-none h-30 overflow-y-auto">
                    <ul className="space-y-1 px-2 py-2 text-sm">
                        {bookings.map((booking) => (
                            <BookingCard
                                key={booking.id}
                                booking={booking}
                                handleClick={handleClick}
                            />
                        ))}
                    </ul>
                </div>
            ) : (
                <p className="px-2 py-2 text-sm">No bookings</p>
            )}

            {selectedBooking && (
                <BookingDialog
                    booking={selectedBooking}
                    onClose={() => setSelectedBooking(null)}
                />
            )}
        </div>
    );
};

export default CalendarDay;
