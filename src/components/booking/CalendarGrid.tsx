"use client";

import CalendarDay from "./CalendarDay";
import BookingCard from "@/components/booking/BookingCard";
import ConfirmDialog from "@/components/booking/ConfirmDialog";
import { BookingInstance } from "@/lib/types";
import {
    bookingsForDay,
    getBookingInstance,
} from "../hooks/calendar-dnd-utils";
import { useCalendarDnD } from "../hooks/calendar-dnd-handlers";
import {
    closestCorners,
    DndContext,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { addDays, format, startOfWeek, subDays } from "date-fns";
import React, { useRef, useState } from "react";
import Navigations from "@/components/Navigations";

const DAYS_PER_LOAD = 7;
const INITIAL_WEEKS = 5;
const CARD_WIDTH = 180;

type Props = {
    bookings: BookingInstance[];
};

const CalendarGrid: React.FC<Props> = ({ bookings }) => {
    const {
        internalBookings,
        activeId,
        overId,
        handleDragStart,
        handleDragOver,
        handleDragEnd,
        confirmChange,
        pendingChange,
        cancelChange,
    } = useCalendarDnD(bookings);

    const containerRef = useRef<HTMLDivElement>(null);
    const loadingRef = useRef(false);

    const [displayedDays, setDisplayedDays] = useState<Date[]>(() => {
        const start = startOfWeek(new Date(), { weekStartsOn: 1 });
        return Array.from({ length: INITIAL_WEEKS * DAYS_PER_LOAD }, (_, i) =>
            addDays(start, i),
        );
    });

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { delay: 200, tolerance: 5 },
        }),
    );

    const scrollToWeek = (direction: "prev" | "next") => {
        if (!containerRef.current) return;

        const offset = direction === "prev" ? -1 : 1;
        containerRef.current.scrollBy({
            left: offset * CARD_WIDTH * 7,
            behavior: "smooth",
        });
    };

    const handleScroll = () => {
        const container = containerRef.current;
        if (!container || loadingRef.current) return;

        const { scrollLeft, scrollWidth, clientWidth } = container;

        if (scrollLeft + clientWidth >= scrollWidth - 100) {
            loadingRef.current = true;

            setDisplayedDays((prev) => {
                const last = prev[prev.length - 1];
                const more = Array.from({ length: DAYS_PER_LOAD }, (_, i) =>
                    addDays(last, i + 1),
                );
                return [...prev, ...more];
            });

            setTimeout(() => (loadingRef.current = false), 100);
        }

        if (scrollLeft <= 10) {
            loadingRef.current = true;

            setDisplayedDays((prev) => {
                const first = prev[0];
                const more = Array.from({ length: DAYS_PER_LOAD }, (_, i) =>
                    subDays(first, DAYS_PER_LOAD - i),
                );
                return [...more, ...prev];
            });

            requestAnimationFrame(() => {
                if (container) {
                    container.scrollLeft += DAYS_PER_LOAD * CARD_WIDTH;
                    loadingRef.current = false;
                }
            });
        }
    };

    return (
        <>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div
                    ref={containerRef}
                    onScroll={handleScroll}
                    className="flex snap-x snap-mandatory space-x-2 overflow-x-auto pb-2"
                >
                    {displayedDays.map((day) => (
                        <div
                            key={day.toISOString()}
                            className="h-44 w-[calc(100%/8)] min-w-[183px] shrink-0 snap-start max-sm:w-[calc(100%/7)]"
                        >
                            <CalendarDay
                                day={day}
                                bookings={bookingsForDay(day, internalBookings)}
                                id={format(day, "MM-dd")}
                                activeId={activeId}
                                overId={overId}
                            />
                        </div>
                    ))}
                </div>

                {pendingChange && (
                    <ConfirmDialog
                        cancelChange={cancelChange}
                        confirmChange={confirmChange}
                        pendingChange={pendingChange}
                    />
                )}

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
            <Navigations scrollToWeek={scrollToWeek} />
        </>
    );
};

export default CalendarGrid;
