import { useCallback, useEffect, useState } from "react";
import { BookingInstance, PendingChange } from "@/lib/types";
import { parse, format } from "date-fns";
import { findContainer, getBookingInstance } from "./calendar-dnd-utils";
import { toast } from "sonner";

export const useCalendarDnD = (bookings: BookingInstance[]) => {
    const [internalBookings, setInternalBookings] = useState(bookings);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [overId, setOverId] = useState<string | null>(null);
    const [pendingChange, setPendingChange] = useState<PendingChange | null>(
        null,
    );

    useEffect(() => {
        setInternalBookings(bookings);
    }, [bookings]);

    const isChangeValid = (change: PendingChange): boolean => {
        const { type, newDate, startDate, endDate } = change;

        const newDateObj = new Date(newDate);
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (
            format(start, "MM-dd") === format(end, "MM-dd") &&
            format(start, "MM-dd") === format(newDateObj, "MM-dd")
        ) {
            return false;
        }

        if (type === "start") {
            return format(newDateObj, "MM-dd") <= format(end, "MM-dd");
        }

        if (type === "end") {
            return format(newDateObj, "MM-dd") >= format(start, "MM-dd");
        }

        return true;
    };

    const isSameDayChange = (
        booking: BookingInstance,
        type: "start" | "end",
        newDate: string,
    ): boolean => {
        const current = new Date(
            type === "start" ? booking.startDate : booking.endDate,
        );
        const newD = new Date(newDate);

        return format(current, "MM-dd") === format(newD, "MM-dd");
    };

    const handleDragStart = useCallback((event: any) => {
        setActiveId(event.active.id);
    }, []);

    const handleDragOver = useCallback((event: any) => {
        const { over } = event;
        if (!over) return;
        setOverId(over.id);
    }, []);

    const handleDragEnd = useCallback(
        (event: any) => {
            const { active, over } = event;
            if (!active || !over) return;

            setActiveId(null);
            setOverId(null);

            const booking = getBookingInstance(active.id, internalBookings);
            if (!booking) return;

            const isDayId = /^\d{2}-\d{2}$/.test(over.id);
            const targetDayId = isDayId
                ? over.id
                : findContainer(over.id, internalBookings);
            if (!targetDayId) return;

            const fullDateStr = `${format(new Date(), "yyyy")}-${targetDayId}`;
            const overDate = parse(fullDateStr, "yyyy-MM-dd", new Date());
            if (isNaN(overDate.getTime())) return;

            if (
                isSameDayChange(booking, booking.type, overDate.toISOString())
            ) {
                return;
            }

            setPendingChange({
                ...booking,
                newDate: overDate.toISOString(),
            });
        },
        [internalBookings],
    );

    const confirmChange = () => {
        if (!pendingChange) return;

        if (!isChangeValid(pendingChange)) {
            toast.error("Invalid date change. Please check the dates.");
            return;
        }

        setInternalBookings((prev) =>
            prev.map((b) =>
                b.id === pendingChange.id && b.type === pendingChange.type
                    ? {
                          ...b,
                          startDate:
                              pendingChange.type === "start"
                                  ? pendingChange.newDate
                                  : b.startDate,
                          endDate:
                              pendingChange.type === "end"
                                  ? pendingChange.newDate
                                  : b.endDate,
                      }
                    : b,
            ),
        );

        // Simulate save API
        console.log("Drag confirmed:", pendingChange);
        setPendingChange(null);
    };

    const cancelChange = () => {
        setPendingChange(null);
    };

    return {
        internalBookings,
        activeId,
        overId,
        pendingChange,
        handleDragStart,
        handleDragOver,
        handleDragEnd,
        confirmChange,
        cancelChange,
    };
};
