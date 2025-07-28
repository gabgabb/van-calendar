import React from "react";
import { Button } from "@/components/ui/button";

type NavigationProps = {
    scrollToWeek: (direction: "prev" | "next") => void;
};

const Navigations: React.FC<NavigationProps> = ({ scrollToWeek }) => {
    return (
        <div className="mb-2 flex flex-wrap justify-center gap-2 sm:gap-4">
            <Button
                variant="ghost"
                className="hover:bg-accent h-10 rounded-md border px-3 py-2 text-sm sm:px-4 sm:text-base"
                onClick={() => scrollToWeek("prev")}
            >
                ⬅️ Prev week
            </Button>
            <Button
                variant="ghost"
                className="hover:bg-accent h-10 rounded-md border px-3 py-2 text-sm sm:px-4 sm:text-base"
                onClick={() => scrollToWeek("next")}
            >
                Next week ➡️
            </Button>
        </div>
    );
};

export default Navigations;
