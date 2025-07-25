import CalendarDay from "./CalendarDay";
import { Booking } from "@/lib/types";
import { format } from "date-fns";
import React from "react";

type Props = {
    days: Date[];
    bookings: Booking[];
};

const CalendarGrid: React.FC<Props> = ({ days, bookings }) => {
    const bookingsForDay = (day: Date) => {
        return bookings.filter((b) => {
            const start = new Date(b.startDate);
            const end = new Date(b.endDate);
            return (
                format(start, "MM-dd") === format(day, "MM-dd") ||
                format(end, "MM-dd") === format(day, "MM-dd")
            );
        });
    };

    return (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
            {days.map((day) => (
                <CalendarDay
                    key={day.toISOString()}
                    day={day}
                    bookings={bookingsForDay(day)}
                />
            ))}
        </div>
    );
};

export default CalendarGrid;
