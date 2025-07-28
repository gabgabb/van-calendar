import { render, screen } from "@testing-library/react";
import BookingCard from "@/components/booking/BookingCard";
import { BookingInstance } from "@/lib/types";

const booking: BookingInstance = {
    id: "1",
    type: "start",
    customerName: "Bob",
    startDate: "2025-07-24T00:00:00Z",
    endDate: "2025-07-30T00:00:00Z",
    pickupReturnStationId: "station-1",
};

describe("BookingCard", () => {
    it("renders booking name and dot color", () => {
        render(<BookingCard booking={booking} />);
        expect(screen.getByText("Bob")).toBeInTheDocument();
        const dot = screen.getByRole("button").querySelector("span");
        expect(dot).toHaveClass("bg-green-500");
    });

    it("renders red dot for end booking", () => {
        render(<BookingCard booking={{ ...booking, type: "end" }} />);
        const dot = screen.getByRole("button").querySelector("span");
        expect(dot).toHaveClass("bg-red-500");
    });

    it("has the correct data-booking-id attribute", () => {
        render(<BookingCard booking={booking} />);
        expect(screen.getByTestId("booking-card-1")).toBeInTheDocument();
    });
});
