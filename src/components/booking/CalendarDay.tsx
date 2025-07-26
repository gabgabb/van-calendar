import { format } from "date-fns";
import { BookingInstance } from "@/lib/types";
import React, { useState } from "react";
import BookingDialog from "./BookingDialog";
import BookingCard from "./BookingCard";
import { useDroppable } from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { isOverFcn } from "@/components/hooks/calendar-dnd-utils";

type Props = {
    day: Date;
    bookings: BookingInstance[];
    id: string;
    activeId: string | null;
    overId: string | null;
};

const CalendarDay: React.FC<Props> = ({
    day,
    bookings,
    id,
    activeId,
    overId,
}) => {
    const [selectedBooking, setSelectedBooking] =
        useState<BookingInstance | null>(null);
    const { setNodeRef } = useDroppable({ id });

    const handleClick = (booking: BookingInstance) => {
        if (!selectedBooking) setSelectedBooking(booking);
    };

    const isOver = isOverFcn(id, overId, bookings);

    return (
        <div
            ref={setNodeRef}
            className={`transition-color bg-card hover:bg-card/80 h-40 rounded-md border shadow-sm transition-shadow hover:shadow-lg ${
                bookings.length ? "" : "text-muted-foreground"
            }`}
        >
            <div className="border-border hover:border-border text-secondary bg-card-foreground/80 rounded-t-md border-b p-1 text-center font-semibold">
                {format(day, "EEEE dd MMM")}
            </div>

            <div className="scrollbar-none h-30 overflow-y-auto">
                {bookings.length ? (
                    <SortableContext
                        id={id}
                        items={bookings.map((b) => `${b.id}-${b.type}`)}
                        strategy={verticalListSortingStrategy}
                    >
                        <ul className="space-y-1 px-2 py-2 text-sm">
                            {bookings.map((booking) => (
                                <BookingCard
                                    key={`${booking.id}-${booking.type}`}
                                    booking={booking}
                                    handleClick={handleClick}
                                    isDragging={
                                        activeId ===
                                        `${booking.id}-${booking.type}`
                                    }
                                />
                            ))}
                            {isOver && (
                                <li className="rounded-md border border-dashed border-gray-400 p-2 text-center text-xs text-gray-400 italic">
                                    Drop here
                                </li>
                            )}
                        </ul>
                    </SortableContext>
                ) : (
                    <p className="px-2 py-2 text-sm">No bookings</p>
                )}
            </div>

            {selectedBooking && (
                <BookingDialog
                    booking={selectedBooking}
                    onClose={() => setSelectedBooking(null)}
                />
            )}
        </div>
    );
};

export default CalendarDay;
