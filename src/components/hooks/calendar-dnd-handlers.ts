import { useCallback, useEffect, useState } from "react";
import { BookingInstance } from "@/lib/types";
import { arrayMove } from "@dnd-kit/sortable";
import { parse, format } from "date-fns";
import {
    formatBookingDate,
    findContainer,
    getBookingInstance,
} from "./calendar-dnd-utils";

export const useCalendarDnD = (bookings: BookingInstance[]) => {
    const [internalBookings, setInternalBookings] = useState(bookings);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [overId, setOverId] = useState<string | null>(null);

    useEffect(() => {
        setInternalBookings(bookings);
    }, [bookings]);

    const handleDragStart = useCallback((event: any) => {
        setActiveId(event.active.id);
    }, []);

    const handleDragOver = useCallback(
        (event: any) => {
            const { active, over } = event;
            if (!over) return;

            setOverId(over.id);

            const [bookingId, type] = active.id.split("-");
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

            setInternalBookings((prev) =>
                prev.map((b) =>
                    b.id === bookingId && b.type === type
                        ? {
                              ...b,
                              startDate:
                                  type === "start"
                                      ? overDate.toISOString()
                                      : b.startDate,
                              endDate:
                                  type === "end"
                                      ? overDate.toISOString()
                                      : b.endDate,
                          }
                        : b,
                ),
            );
        },
        [internalBookings],
    );

    const handleDragEnd = useCallback(
        (event: any) => {
            const { active, over } = event;
            if (!active || !over) return;

            setActiveId(null);
            setOverId(null);

            if (active.id === over.id) return;

            const activeContainer = findContainer(active.id, internalBookings);
            const overContainer = findContainer(over.id, internalBookings);

            if (activeContainer === overContainer) {
                const items = internalBookings.filter(
                    (b) => formatBookingDate(b) === activeContainer,
                );

                const oldIndex = items.findIndex(
                    (b) => `${b.id}-${b.type}` === active.id,
                );
                const newIndex = items.findIndex(
                    (b) => `${b.id}-${b.type}` === over.id,
                );

                if (oldIndex >= 0 && newIndex >= 0) {
                    const reordered = arrayMove(items, oldIndex, newIndex);
                    const other = internalBookings.filter(
                        (b) => formatBookingDate(b) !== activeContainer,
                    );
                    setInternalBookings([...other, ...reordered]);
                }
            }

            const booking = getBookingInstance(active.id, internalBookings);
            if (booking) {
                console.log("New date saved:", {
                    id: booking.id,
                    type: booking.type,
                    newDate:
                        booking.type === "start"
                            ? booking.startDate
                            : booking.endDate,
                });
            }
        },
        [internalBookings],
    );

    return {
        internalBookings,
        activeId,
        overId,
        handleDragStart,
        handleDragOver,
        handleDragEnd,
    };
};
