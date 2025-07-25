import { addDays } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

type NavigationProps = {
    selectedStation: any;
    setCurrentWeekStart: React.Dispatch<React.SetStateAction<Date>>;
};

const Navigations: React.FC<NavigationProps> = ({
    selectedStation,
    setCurrentWeekStart,
}) => {
    return (
        <div
            className={`flex items-center justify-center gap-2 font-bold ${!selectedStation ? "pointer-events-none opacity-30" : ""}`}
        >
            <button
                onClick={() => setCurrentWeekStart((prev) => addDays(prev, -7))}
                className="bg-input hover:bg-input/70 flex h-12 w-24 cursor-pointer items-center justify-center gap-2 rounded-md shadow"
            >
                <ChevronLeft /> Prev
            </button>
            <button
                onClick={() => setCurrentWeekStart((prev) => addDays(prev, 7))}
                className="bg-input hover:bg-input/70 flex h-12 w-24 cursor-pointer items-center justify-center gap-2 rounded-md shadow"
            >
                Next <ChevronRight />
            </button>
        </div>
    );
};

export default Navigations;
