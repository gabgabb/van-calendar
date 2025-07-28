import { render, screen } from "@testing-library/react";
import BookingDialog from "@/components/booking/BookingDialog";
import { BookingInstance } from "@/lib/types";

global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({ name: "Station Mock" }),
    }),
) as jest.Mock;

const booking: BookingInstance = {
    id: "1",
    type: "start",
    startDate: "2025-07-25T00:00:00.000Z",
    endDate: "2025-07-28T00:00:00.000Z",
    customerName: "Alice",
    pickupReturnStationId: "station-1",
};

test("BookingDialog renders with booking info", async () => {
    render(<BookingDialog booking={booking} onClose={() => {}} />);
    expect(await screen.findByText("Alice")).toBeInTheDocument();
});
