"use client";

import React from "react";
import { BookingInstance } from "@/lib/types";
import { useBookingSortable } from "../hooks/useBookingSortable";
import { cn } from "@/lib/utils";

interface Props {
    booking: BookingInstance;
    handleClick?: (booking: BookingInstance) => void;
    isDragging?: boolean;
}

const BookingCard: React.FC<Props> = ({ booking, handleClick, isDragging }) => {
    const id = `${booking.id}-${booking.type}`;
    const { setNodeRef, attributes, listeners, sortableDragging } =
        useBookingSortable(id, booking);

    const color = booking.type === "start" ? "bg-green-500" : "bg-red-500";

    return (
        <li
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            data-testid={`booking-card-${booking.id}`}
            onClick={() => {
                if (!sortableDragging && handleClick) handleClick(booking);
            }}
            className={cn(
                "cursor-grab touch-none select-none active:cursor-grabbing",
                "bg-card-foreground flex items-center gap-2 rounded-md px-2 py-1 transition-transform duration-150",
                isDragging ? "opacity-30" : "",
            )}
        >
            <span className={cn("size-2 animate-pulse rounded-full", color)} />
            <span className="text-secondary w-32 truncate">
                {booking.customerName}
            </span>
        </li>
    );
};

export default BookingCard;
