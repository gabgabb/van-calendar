import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BookingInstance } from "@/lib/types";

export const useBookingSortable = (id: string, booking: BookingInstance) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging: sortableDragging,
    } = useSortable({
        id,
        data: {
            type: booking.type,
            bookingId: booking.id,
        },
    });

    const style = {
        transform: CSS.Transform.toString({
            x: transform?.x ?? 0,
            y: transform?.y ?? 0,
            scaleX: 1,
            scaleY: 1,
        }),
        transition,
        zIndex: 5,
    };

    return { setNodeRef, attributes, listeners, style, sortableDragging };
};
