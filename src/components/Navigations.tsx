import React from "react";
import { Button } from "@/components/ui/button";

type NavigationProps = {
    scrollToWeek: (direction: "prev" | "next") => void;
};

const Navigations: React.FC<NavigationProps> = ({ scrollToWeek }) => {
    return (
        <div className="mb-2 flex justify-center gap-4">
            <Button
                variant={"ghost"}
                className="hover:bg-accent h-10 rounded-md border px-4 py-2"
                onClick={() => scrollToWeek("prev")}
            >
                ⬅️ Prev week
            </Button>
            <Button
                variant={"ghost"}
                className="hover:bg-accent h-10 rounded-md border px-4 py-2"
                onClick={() => scrollToWeek("next")}
            >
                Next week ➡️
            </Button>
        </div>
    );
};

export default Navigations;
