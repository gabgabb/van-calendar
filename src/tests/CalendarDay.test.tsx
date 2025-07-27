import { render, screen } from "@testing-library/react";
import CalendarDay from "@/components/booking/CalendarDay";
import { BookingInstance } from "@/lib/types";

const bookings: BookingInstance[] = [
    {
        id: "1",
        type: "start",
        startDate: "2025-07-25T00:00:00.000Z",
        endDate: "2025-07-28T00:00:00.000Z",
        customerName: "Alice",
        pickupReturnStationId: "station-1",
    },
];

test("renders CalendarDay with correct title", () => {
    const date = new Date("2025-07-25");
    render(
        <CalendarDay
            day={date}
            bookings={bookings}
            id="07-25"
            activeId={null}
            overId={null}
        />,
    );
    expect(screen.getByText(/friday/i)).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
});
