import { renderHook, act } from "@testing-library/react";
import { useCalendarDnD } from "@/components/hooks/calendar-dnd-handlers";
import { BookingInstance } from "@/lib/types";
import { format } from "date-fns";

beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date("2025-07-25"));
});
afterAll(() => {
    jest.useRealTimers();
});

const bookings: BookingInstance[] = [
    {
        id: "1",
        type: "start",
        startDate: "2025-07-25T00:00:00.000Z",
        endDate: "2025-07-28T00:00:00.000Z",
        customerName: "Alice",
        pickupReturnStationId: "station-1",
    },
    {
        id: "1",
        type: "end",
        startDate: "2025-07-25T00:00:00.000Z",
        endDate: "2025-07-28T00:00:00.000Z",
        customerName: "Alice",
        pickupReturnStationId: "station-1",
    },
];

describe("useCalendarDnD", () => {
    it("initializes internal state correctly", () => {
        const { result } = renderHook(() => useCalendarDnD(bookings));
        expect(result.current.internalBookings.length).toBe(2);
    });

    it("sets pending change on valid drag over", () => {
        const { result } = renderHook(() => useCalendarDnD(bookings));

        act(() => {
            result.current.handleDragEnd({
                active: { id: "1-end" },
                over: { id: "07-30" },
            });
        });

        expect(result.current.pendingChange).toBeDefined();
        expect(result.current.pendingChange?.newDate).toContain("2025-07-29");
    });

    it("does NOT set pendingChange if dragging end before start", () => {
        const { result } = renderHook(() => useCalendarDnD(bookings));
        act(() =>
            result.current.handleDragOver({
                active: { id: "1-end" },
                over: { id: "07-24" },
            }),
        );
        expect(result.current.pendingChange).toBeNull();
    });

    it("confirms and applies booking change", () => {
        const { result } = renderHook(() => useCalendarDnD(bookings));

        act(() => {
            result.current.handleDragEnd({
                active: { id: "1-end" },
                over: { id: "07-30" },
            });
        });

        act(() => result.current.confirmChange());

        const updatedEnd = result.current.internalBookings.find(
            (b) => b.type === "end",
        );

        expect(updatedEnd).toBeDefined();
        expect(format(new Date(updatedEnd!.endDate), "MM-dd")).toBe("07-30");
    });

    it("cancels pending change correctly", () => {
        const { result } = renderHook(() => useCalendarDnD(bookings));

        act(() =>
            result.current.handleDragOver({
                active: { id: "1-start" },
                over: { id: "07-26" },
            }),
        );

        act(() => result.current.cancelChange());

        expect(result.current.pendingChange).toBeNull();
    });
});
