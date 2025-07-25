"use client";

import React, { useEffect, useMemo, useState } from "react";
import { addDays, startOfWeek } from "date-fns";
import { useStationStore } from "@/store/station";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Booking } from "@/lib/types";
import CalendarGrid from "@/components/CalendarGrid";

const CalendarView: React.FC = () => {
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

        fetch(`${process.env.API_URL}/stations/${selectedStation.id}`)
            .then((res) => res.json())
            .then((data) => setBookings(data.bookings || []))
            .catch(() => setBookings([]));
    }, [selectedStation]);

    return (
        <div className="relative space-y-6 rounded-md p-4 font-mono">
            {!selectedStation && (
                <div className="absolute inset-0 z-10 flex items-center justify-center backdrop-blur-xs">
                    <p className="text-center text-lg font-semibold">
                        Please select a station to view the calendar.
                    </p>
                </div>
            )}
            <CalendarGrid days={days} bookings={bookings} />

            <div
                className={`flex items-center justify-center gap-2 font-bold ${!selectedStation ? "pointer-events-none opacity-30" : ""}`}
            >
                <button
                    onClick={() =>
                        setCurrentWeekStart((prev) => addDays(prev, -7))
                    }
                    className="bg-input hover:bg-input/70 flex h-12 w-24 cursor-pointer items-center justify-center gap-2 rounded-md shadow"
                >
                    <ChevronLeft /> Prev
                </button>
                <button
                    onClick={() =>
                        setCurrentWeekStart((prev) => addDays(prev, 7))
                    }
                    className="bg-input hover:bg-input/70 flex h-12 w-24 cursor-pointer items-center justify-center gap-2 rounded-md shadow"
                >
                    Next <ChevronRight />
                </button>
            </div>
        </div>
    );
};

export default CalendarView;
