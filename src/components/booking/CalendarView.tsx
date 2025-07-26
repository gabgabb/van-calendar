"use client";

import React, { useEffect, useMemo, useState } from "react";
import { addDays, startOfWeek } from "date-fns";
import { useStationStore } from "@/store/station";
import { Booking, BookingInstance } from "@/lib/types";
import CalendarGrid from "@/components/booking/CalendarGrid";
import Navigations from "@/components/Navigations";
import CalendarSkeleton from "@/components/skeletons/CalendarSkeleton";

const CalendarView: React.FC = () => {
    const selectedStation = useStationStore((s) => s.selectedStation);

    const [currentWeekStart, setCurrentWeekStart] = useState(
        startOfWeek(new Date(), { weekStartsOn: 1 }),
    );
    const [bookings, setBookings] = useState<BookingInstance[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const days = useMemo(
        () => Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i)),
        [currentWeekStart],
    );

    useEffect(() => {
        setIsLoading(true);
        if (!selectedStation) return setIsLoading(false);
        fetch(`${process.env.API_URL}/stations/${selectedStation.id}`)
            .then((res) => res.json())
            .then((data) => {
                const rawBookings: Booking[] = data.bookings || [];

                const instances: BookingInstance[] = rawBookings.flatMap(
                    (b) => [
                        { ...b, type: "start" },
                        { ...b, type: "end" },
                    ],
                );

                setBookings(instances);
            })
            .catch(() => setBookings([]))
            .finally(() => setIsLoading(false));
    }, [selectedStation]);

    return (
        <div className="relative space-y-6 rounded-md p-4 font-mono">
            {isLoading ? (
                <CalendarSkeleton days={days} />
            ) : (
                <CalendarGrid days={days} bookings={bookings} />
            )}

            {!selectedStation && (
                <div className="bg-background/70 absolute inset-0 z-10 flex items-center justify-center backdrop-blur-sm">
                    <p className="text-center text-lg font-semibold">
                        Please select a station to view the calendar.
                    </p>
                </div>
            )}

            <Navigations
                selectedStation={selectedStation}
                setCurrentWeekStart={setCurrentWeekStart}
            />
        </div>
    );
};

export default CalendarView;
