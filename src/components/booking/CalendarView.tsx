"use client";

import React, { useEffect, useState } from "react";
import { useStationStore } from "@/store/station";
import { Booking, BookingInstance } from "@/lib/types";
import CalendarGrid from "@/components/booking/CalendarGrid";
import CalendarSkeleton from "@/components/skeletons/CalendarSkeleton";

const CalendarView: React.FC = () => {
    const selectedStation = useStationStore((s) => s.selectedStation);

    const [bookings, setBookings] = useState<BookingInstance[]>([]);
    const [isLoading, setIsLoading] = useState(false);

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
                <CalendarSkeleton />
            ) : (
                <CalendarGrid bookings={bookings} />
            )}

            {!selectedStation && (
                <div className="bg-background/70 absolute inset-0 z-10 m-0 flex items-center justify-center backdrop-blur-sm">
                    <p className="text-center text-lg font-semibold">
                        Please select a station to view the calendar.
                    </p>
                </div>
            )}
        </div>
    );
};

export default CalendarView;
