// BookingCard.tsx
"use client";

import React from "react";
import { BookingInstance } from "@/lib/types";
import { useBookingSortable } from "../hooks/useBookingSortable";

interface Props {
    booking: BookingInstance;
    handleClick?: (booking: BookingInstance) => void;
    isDragging?: boolean;
}

const BookingCard: React.FC<Props> = ({ booking, handleClick, isDragging }) => {
    const id = `${booking.id}-${booking.type}`;
    const { setNodeRef, attributes, listeners, style, sortableDragging } =
        useBookingSortable(id, booking);

    const color = booking.type === "start" ? "bg-green-500" : "bg-red-500";

    return (
        <li
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={() => {
                if (!sortableDragging && handleClick) handleClick(booking);
            }}
            className={`flex w-max cursor-pointer items-center gap-2 rounded-md border bg-white px-2 py-1 transition-transform duration-150 select-none hover:scale-103 hover:opacity-90 hover:shadow ${
                isDragging ? "opacity-30" : ""
            }`}
        >
            <span className={`size-2 animate-pulse rounded-full ${color}`} />
            <span className="w-32 truncate">{booking.customerName}</span>
        </li>
    );
};

export default BookingCard;
