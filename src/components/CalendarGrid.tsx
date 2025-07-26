import CalendarDay from "./CalendarDay";
import { BookingInstance } from "@/lib/types";
import { format } from "date-fns";
import React, { useState } from "react";
import {
    closestCorners,
    DndContext,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";

type Props = {
    days: Date[];
    bookings: BookingInstance[];
};

const CalendarGrid: React.FC<Props> = ({ days, bookings }) => {
    const [activeId, setActiveId] = useState();

    const bookingsForDay = (day: Date) => {
        const dayStr = format(day, "MM-dd");

        return bookings.filter((b) => {
            const date = b.type === "start" ? b.startDate : b.endDate;
            return format(new Date(date), "MM-dd") === dayStr;
        });
    };

    console.log(bookings);

    const sensors = useSensors(useSensor(PointerSensor));

    const handleDragStart = (event: any) => {
        const { active } = event;
        const { id } = active;

        setActiveId(id);
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
        >
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
                {days.map((day) => (
                    <CalendarDay
                        key={day.toISOString()}
                        day={day}
                        bookings={bookingsForDay(day)}
                    />
                ))}
            </div>
        </DndContext>
    );
};

export default CalendarGrid;
