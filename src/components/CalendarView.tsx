"use client";

import { useEffect, useMemo, useState } from "react";
import { addDays, format, startOfWeek } from "date-fns";
import { useStationStore } from "@/store/station";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Booking } from "@/lib/types";

export default function CalendarView() {
    const selectedStation = useStationStore((s) => s.selectedStation);

    const [currentWeekStart, setCurrentWeekStart] = useState(
        startOfWeek(new Date(), { weekStartsOn: 1 }),
    );
    const [bookings, setBookings] = useState<Booking[]>([]);

    const days = useMemo(
        () => Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i)),
        [currentWeekStart],
    );

    useEffect(() => {
        if (!selectedStation) return;

        fetch(
            `https://605c94c36d85de00170da8b4.mockapi.io/stations/${selectedStation.id}`,
        )
            .then((res) => res.json())
            .then((data) => setBookings(data.bookings || []))
            .catch(() => setBookings([]));
    }, [selectedStation]);

    const goToPreviousWeek = () => {
        setCurrentWeekStart((prev) => addDays(prev, -7));
    };

    const goToNextWeek = () => {
        setCurrentWeekStart((prev) => addDays(prev, 7));
    };

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

    const handleBookingClick = (booking: Booking) => {
        alert(`Booking details:\n\nCustomer: ${booking.customerName}\nFrom: ${booking.startDate}\nTo: ${booking.endDate}`);
        // replace with modal or route navigation later
    };

    return (
        <div className="relative space-y-6 rounded-md p-4 font-mono">
            {!selectedStation && (
                <div className="absolute inset-0 z-10 flex items-center justify-center backdrop-blur-xs">
                    <p className="text-center font-mono text-lg font-semibold">
                        Please select a station to view the calendar.
                    </p>
                </div>
            )}

            <div
                className={`grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 ${
                    !selectedStation
                        ? "pointer-events-none opacity-30 select-none"
                        : ""
                }`}
            >
                {days.map((day) => {
                    const dailyBookings = bookingsForDay(day);
                    const hasBookings = dailyBookings.length > 0;

                    return (
                        <div
                            key={day.toISOString()}
                            className={`transition-color h-40 rounded-md border shadow-sm transition-shadow ${
                                hasBookings
                                    ? "bg-card hover:bg-card/80 cursor-pointer text-green-800 transition-colors hover:shadow-lg"
                                    : "bg-muted text-muted-foreground cursor-not-allowed"
                            }`}
                        >
                            <div className="border-border hover:border-border text-secondary bg-card-foreground/80 mb-2 rounded-t-md border-b p-1 text-center font-semibold">
                                {format(day, "EEEE dd MMM")}
                            </div>
                            {hasBookings ? (
                                <ul className="space-y-1 text-sm px-2">
                                    {dailyBookings.map((b) => (
                                        <li
                                            key={b.id}
                                            onClick={() =>
                                                handleBookingClick(b)
                                            }
                                            className="cursor-pointer underline hover:opacity-70"
                                        >
                                            {b.customerName}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm px-2">No bookings</p>
                            )}
                        </div>
                    );
                })}
            </div>

            <div
                className={`flex items-center justify-center gap-2 font-bold ${
                    !selectedStation ? "pointer-events-none opacity-30" : ""
                }`}
            >
                <button
                    onClick={goToPreviousWeek}
                    className="bg-input hover:bg-input/70 flex h-12 w-24 cursor-pointer items-center justify-center gap-2 rounded-md px-2 py-1 transition-colors"
                >
                    <ChevronLeft />
                    <span className="mb-0.5">Prev </span>
                </button>
                <button
                    onClick={goToNextWeek}
                    className="bg-input hover:bg-input/70 flex h-12 w-24 cursor-pointer items-center justify-center gap-2 rounded-md px-2 py-1 transition-colors"
                >
                    <span className="mb-0.5">Next </span>
                    <ChevronRight />
                </button>
            </div>
        </div>
    );
}
