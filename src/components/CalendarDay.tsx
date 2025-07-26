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

type Props = {
    day: Date;
    bookings: BookingInstance[];
    id: string;
    activeId: string | null;
    overId?: string | null;
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

    const handleClick = (booking: BookingInstance) =>
        setSelectedBooking(booking);

    const hasBookings = bookings.length > 0;

    const { setNodeRef } = useDroppable({ id });

    const isOver = (() => {
        if (!overId) return false;
        // ex: overId = "32-start" ou "07-25"
        if (/^\d{2}-\d{2}$/.test(overId)) {
            return overId === id;
        }
        // sinon, c'est un booking — on retrouve son jour
        const [bookingId, type] = overId.split("-");
        const dummyBooking: BookingInstance | undefined = bookings.find(
            (b) => b.id === bookingId && b.type === type,
        );
        if (!dummyBooking) return false;
        const date =
            type === "start"
                ? new Date(dummyBooking.startDate)
                : new Date(dummyBooking.endDate);
        return format(date, "MM-dd") === id;
    })();

    return (
        <div
            ref={setNodeRef}
            className={`transition-color bg-card hover:bg-card/80 h-40 rounded-md border shadow-sm transition-shadow hover:shadow-lg ${
                hasBookings ? "" : "text-muted-foreground"
            }`}
        >
            <div className="border-border hover:border-border text-secondary bg-card-foreground/80 rounded-t-md border-b p-1 text-center font-semibold">
                {format(day, "EEEE dd MMM")}
            </div>

            {hasBookings ? (
                <SortableContext
                    id={id}
                    items={bookings.map((b) => `${b.id}-${b.type}`)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="scrollbar-none h-30 overflow-y-auto">
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
                    </div>
                </SortableContext>
            ) : (
                <p className="px-2 py-2 text-sm">No bookings</p>
            )}

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
