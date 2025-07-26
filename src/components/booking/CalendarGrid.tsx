import CalendarDay from "./CalendarDay";
import { BookingInstance } from "@/lib/types";
import { format } from "date-fns";
import React from "react";
import {
    closestCorners,
    DndContext,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import BookingCard from "@/components/booking/BookingCard";
import {
    bookingsForDay,
    getBookingInstance,
} from "../hooks/calendar-dnd-utils";
import { useCalendarDnD } from "../hooks/calendar-dnd-handlers";

type Props = {
    days: Date[];
    bookings: BookingInstance[];
};

const CalendarGrid: React.FC<Props> = ({ days, bookings }) => {
    const {
        internalBookings,
        activeId,
        overId,
        handleDragStart,
        handleDragOver,
        handleDragEnd,
    } = useCalendarDnD(bookings);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { delay: 200, tolerance: 5 },
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
                        bookings={bookingsForDay(day, internalBookings)}
                        id={format(day, "MM-dd")}
                        activeId={activeId}
                        overId={overId}
                    />
                ))}
            </div>
            <DragOverlay>
                {activeId &&
                    (() => {
                        const booking = getBookingInstance(
                            activeId,
                            internalBookings,
                        );
                        return booking ? (
                            <BookingCard booking={booking} />
                        ) : null;
                    })()}
            </DragOverlay>
        </DndContext>
    );
};

export default CalendarGrid;
