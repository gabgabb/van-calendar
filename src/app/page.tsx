"use client";

import Autocomplete from "@/components/Autocomplete";
import { useStationStore } from "@/store/station";
import { toast } from "sonner";
import { useEffect, useRef } from "react";
import CalendarView from "@/components/booking/CalendarView";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
    const station = useStationStore((s) => s.selectedStation);
    const hasHydrated = useStationStore((s) => s.hasHydrated);
    const firstLoadRef = useRef(true);

    useEffect(() => {
        if (!hasHydrated) return;

        if (firstLoadRef.current) {
            firstLoadRef.current = false;
            return;
        }

        if (station) {
            toast.success(`New station selected : ${station.name}`);
        }
    }, [station, hasHydrated]);

    return (
        <main className="mx-auto flex max-w-[1400px] flex-col gap-10 p-4">
            <div className="mx-auto flex w-full flex-col items-center">
                {!hasHydrated ? (
                    <Skeleton className="mb-4 h-8 w-64" />
                ) : (
                    <h1 className="mb-4 font-mono text-2xl font-bold">
                        {station
                            ? `Selected Station: ${station.name}`
                            : "Select a Station"}
                    </h1>
                )}
                <div className="flex w-1/5 max-w-md items-center justify-center">
                    <Autocomplete />
                </div>
            </div>
            <div className="flex w-full flex-col">
                <CalendarView />
            </div>
        </main>
    );
}
