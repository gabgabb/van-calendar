"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { BookingInstance } from "@/lib/types";
import { format, differenceInCalendarDays, parse } from "date-fns";
import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
    booking: BookingInstance;
    onClose: () => void;
};

const BookingDialog: React.FC<Props> = ({ booking, onClose }) => {
    // Normalize dates to a fake year to avoid issues with year differences
    const normalizeToFakeYear = (dateStr: string) =>
        parse(
            format(new Date(dateStr), "MM-dd"),
            "MM-dd",
            new Date("2000-01-01"),
        );

    const duration = differenceInCalendarDays(
        normalizeToFakeYear(booking.endDate),
        normalizeToFakeYear(booking.startDate),
    );

    const [stationName, setStationName] = useState<string | null>(null);

    useEffect(() => {
        if (!booking.pickupReturnStationId) {
            setStationName("Unknown");
            return;
        }

        fetch(
            `${process.env.API_URL}/stations/${booking.pickupReturnStationId}`,
        )
            .then((res) => res.json())
            .then((data) => setStationName(data.name || "Unknown"))
            .catch(() => setStationName("Unknown"));
    }, [booking.pickupReturnStationId]);

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="font-mono">
                <DialogHeader>
                    <DialogTitle>Booking Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-2 text-sm">
                    <p>
                        <strong>Customer:</strong> {booking.customerName}
                    </p>
                    <p>
                        <strong>From:</strong>{" "}
                        {format(new Date(booking.startDate), "PP")}
                    </p>
                    <p>
                        <strong>To:</strong>{" "}
                        {format(new Date(booking.endDate), "PP")}
                    </p>
                    <p>
                        <strong>Duration:</strong> {duration} day(s)
                    </p>
                    {stationName === null ? (
                        <div className="flex items-center gap-2">
                            <strong>Station:</strong>
                            <Skeleton className="h-5 w-20" />
                        </div>
                    ) : (
                        <p>
                            <strong>Station:</strong> {stationName}
                        </p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default BookingDialog;
