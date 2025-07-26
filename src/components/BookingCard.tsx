import React from "react";
import { BookingInstance } from "@/lib/types";

type Props = {
    booking: BookingInstance;
    handleClick?: (booking: BookingInstance) => void;
};

const BookingCard: React.FC<Props> = ({ booking, handleClick }) => {
    const color = booking.type === "start" ? "bg-green-500" : "bg-red-500";

    return (
        <li
            key={booking.id}
            onClick={() => (handleClick ? handleClick(booking) : null)}
            className="flex w-max cursor-pointer items-center gap-2 rounded-md border px-2 py-1 transition-transform duration-150 hover:scale-103 hover:opacity-90 hover:shadow"
        >
            <span className={`size-2 animate-pulse rounded-full ${color}`} />
            <span className="w-32 truncate">{booking.customerName}</span>
        </li>
    );
};

export default BookingCard;
