import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const CalendarSkeleton: React.FC = () => {
    const placeholders = Array.from({ length: 7 });

    return (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
            {placeholders.map((_, index) => (
                <div
                    key={index}
                    className="bg-muted h-40 rounded-md border p-2 shadow-sm"
                >
                    <Skeleton className="bg-muted-foreground/20 mb-2 h-5 w-3/4 rounded" />
                    <div className="space-y-2">
                        <Skeleton className="bg-muted-foreground/10 h-3 w-full" />
                        <Skeleton className="bg-muted-foreground/10 h-3 w-2/3" />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CalendarSkeleton;
