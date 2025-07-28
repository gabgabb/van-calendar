"use client";

import Autocomplete from "@/components/Autocomplete";
import { useStationStore } from "@/store/station";
import { toast } from "sonner";
import { useEffect, useRef } from "react";
import CalendarView from "@/components/booking/CalendarView";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

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
            <div className="mx-auto flex w-full flex-col items-center gap-4 font-mono">
                {!hasHydrated ? (
                    <div className="flex w-full justify-between">
                        <Skeleton className="h-9 w-64" />
                        <Skeleton className="size-8 rounded-full" />
                    </div>
                ) : (
                    <div className="flex w-full justify-between">
                        {station ? (
                            <div>
                                {/* Desktop */}
                                <h1 className="flex items-center gap-2 text-xl font-bold md:text-2xl lg:text-3xl">
                                    <MapPin className="text-primary h-6 w-6" />
                                    {station.name}
                                </h1>
                            </div>
                        ) : (
                            <h1 className="flex items-center gap-2 text-lg font-bold sm:text-xl md:text-2xl">
                                <MapPin className="text-primary h-6 w-6" />
                                Van calendar
                            </h1>
                        )}
                        <ThemeToggle />
                    </div>
                )}

                <div className="flex w-full max-w-[320px] min-w-[200px] items-center justify-center sm:w-4/5 md:w-3/5 lg:w-2/5">
                    <Autocomplete />
                </div>
            </div>

            <div className="flex w-full flex-col">
                <CalendarView />
            </div>
        </main>
    );
}
