import CalendarDay from "./CalendarDay";
import { BookingInstance } from "@/lib/types";
import { format, parse } from "date-fns";
import React, { useEffect, useState } from "react";
import {
    closestCorners,
    DndContext,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import BookingCard from "@/components/BookingCard";

type Props = {
    days: Date[];
    bookings: BookingInstance[];
};

const CalendarGrid: React.FC<Props> = ({ days, bookings }) => {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [internalBookings, setInternalBookings] =
        useState<BookingInstance[]>(bookings);
    const [overId, setOverId] = useState<string | null>(null);

    useEffect(() => {
        setInternalBookings(bookings);
    }, [bookings]);

    const bookingsForDay = (day: Date) => {
        const dayStr = format(day, "MM-dd");

        return internalBookings.filter((b) => {
            const date = b.type === "start" ? b.startDate : b.endDate;
            return format(new Date(date), "MM-dd") === dayStr;
        });
    };

    const getBookingInstance = (id: string): BookingInstance | undefined => {
        const [bookingId, type] = id.split("-");
        return internalBookings.find(
            (b) => b.id === bookingId && b.type === type,
        );
    };

    const handleDragStart = (event: any) => {
        setActiveId(event.active.id);
    };

    const findContainer = (id: string): string | undefined => {
        const booking = internalBookings.find(
            (b) => `${b.id}-${b.type}` === id,
        );
        if (!booking) return undefined;

        const date =
            booking.type === "start" ? booking.startDate : booking.endDate;

        return format(new Date(date), "MM-dd");
    };

    const handleDragOver = (event: any) => {
        const { active, over } = event;
        if (!over) return;

        setOverId(over.id);
        const [bookingId, type] = active.id.split("-");
        const booking = internalBookings.find(
            (b) => b.id === bookingId && b.type === type,
        );
        if (!booking) return;

        let targetDayId: string | undefined;

        // Vérifie si over.id est un jour (format MM-DD) ou une réservation (id-type)
        if (typeof over.id === "string" && /^\d{2}-\d{2}$/.test(over.id)) {
            // ex: "07-24" → jour
            targetDayId = over.id;
        } else {
            // ex: "31-end" → réservation
            targetDayId = findContainer(over.id);
        }

        if (!targetDayId) {
            console.warn(
                "⚠️ Impossible de trouver le jour de drop pour:",
                over.id,
            );
            return;
        }

        const today = new Date();
        const fullDateStr = `${format(today, "yyyy")}-${targetDayId}`;
        console.log("🗓️ Date reconstruite:", fullDateStr);

        const overDate = parse(fullDateStr, "yyyy-MM-dd", new Date());

        if (isNaN(overDate.getTime())) {
            console.warn("❌ Date invalide:", fullDateStr);
            return;
        }

        // Mise à jour des dates dans internalBookings
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
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (!active || !over) return;

        setActiveId(null);
                setOverId(null);

        if (active.id === over.id) return;

        const activeContainer = findContainer(active.id);
        const overContainer = findContainer(over.id);

        if (activeContainer === overContainer) {
            const items = internalBookings.filter(
                (b) =>
                    format(
                        new Date(b.type === "start" ? b.startDate : b.endDate),
                        "MM-dd",
                    ) === activeContainer,
            );

            const oldIndex = items.findIndex(
                (b) => `${b.id}-${b.type}` === active.id,
            );
            const newIndex = items.findIndex(
                (b) => `${b.id}-${b.type}` === over.id,
            );

            const newOrdered = arrayMove(items, oldIndex, newIndex);

            // Reconstruct internalBookings with reordered items
            const updated = internalBookings.filter(
                (b) =>
                    format(
                        new Date(b.type === "start" ? b.startDate : b.endDate),
                        "MM-dd",
                    ) !== activeContainer,
            );

            setInternalBookings([...updated, ...newOrdered]);

        }

        const booking = getBookingInstance(activeId);
        if (booking) {
            console.log("📦 Nouvelle date sauvegardée :", {
                id: booking.id,
                type: booking.type,
                newDate:
                    booking.type === "start"
                        ? booking.startDate
                        : booking.endDate,
            });

            // Call PATCH API to save the new date
        }
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                delay: 200,
                tolerance: 5,
            },
        }),
    );

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
                {days.map((day) => (
                    <CalendarDay
                        key={day.toISOString()}
                        day={day}
                        bookings={bookingsForDay(day)}
                        id={format(day, "MM-dd")}
                        activeId={activeId}
                        overId={overId}
                    />
                ))}
            </div>
            <DragOverlay>
                {activeId
                    ? (() => {
                          const booking = getBookingInstance(activeId);
                          return booking ? (
                              <BookingCard booking={booking} />
                          ) : null;
                      })()
                    : null}
            </DragOverlay>
        </DndContext>
    );
};

export default CalendarGrid;
