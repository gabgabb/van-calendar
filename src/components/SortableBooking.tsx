import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Booking } from "@/lib/types";

type Props = { booking: Booking; onClick: () => void };

const SortableBooking: React.FC<Props> = ({ booking, onClick }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: booking.id });
    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <li
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={onClick}
            className="flex w-max items-center gap-2 rounded-md border px-2 py-1 transition-transform duration-150 hover:scale-103 hover:opacity-90 hover:shadow"
        >
            <span className="size-2 animate-pulse rounded-full bg-green-500" />
            <span>{booking.customerName}</span>
        </li>
    );
};

export default SortableBooking;
