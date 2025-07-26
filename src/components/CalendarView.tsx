"use client";

import React, { useEffect, useMemo, useState } from "react";
import { addDays, startOfWeek } from "date-fns";
import { useStationStore } from "@/store/station";
import { BookingInstance } from "@/lib/types";
import CalendarGrid from "@/components/CalendarGrid";
import Navigations from "@/components/Navigations";

const CalendarView: React.FC = () => {
    const selectedStation = useStationStore((s) => s.selectedStation);

    const [currentWeekStart, setCurrentWeekStart] = useState(
        startOfWeek(new Date(), { weekStartsOn: 1 }),
    );
    const [bookings, setBookings] = useState<BookingInstance[]>([]);

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

            <Navigations
                selectedStation={selectedStation}
                setCurrentWeekStart={setCurrentWeekStart}
            />
        </div>
    );
};

export default CalendarView;
