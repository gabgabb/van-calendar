import { format } from "date-fns";
import { Booking } from "@/lib/types";
import React, { useState } from "react";
import BookingDialog from "./BookingDialog";

type Props = {
    day: Date;
    bookings: Booking[];
};

const CalendarDay: React.FC<Props> = ({ day, bookings }) => {
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(
        null,
    );

    const handleClick = (booking: Booking) => setSelectedBooking(booking);
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
                        {bookings.map((b) => {
                            const isStart =
                                format(new Date(b.startDate), "MM-dd") ===
                                format(day, "MM-dd");
                            const color = isStart
                                ? "bg-green-500"
                                : "bg-red-500";

                            return (
                                <li
                                    key={b.id}
                                    onClick={() => handleClick(b)}
                                    className="flex w-max cursor-pointer items-center gap-2 rounded-md border px-2 py-1 transition-transform duration-150 hover:scale-103 hover:opacity-90 hover:shadow"
                                >
                                    <span
                                        className={`size-2 animate-pulse rounded-full ${color}`}
                                    />
                                    <span>{b.customerName}</span>
                                </li>
                            );
                        })}
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
