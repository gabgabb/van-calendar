"use client";

import Autocomplete from "@/components/Autocomplete";
import { useStationStore } from "@/store/station";
import { toast } from "sonner";
import { useEffect, useRef } from "react";
import CalendarView from "@/components/booking/CalendarView";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin } from "lucide-react";

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
                    <>
                        {station ? (
                            <>
                                {/* Desktop */}
                                <h1 className="hidden items-center gap-2 font-mono text-xl font-bold sm:flex md:text-2xl lg:text-3xl">
                                    <MapPin className="text-primary h-6 w-6" />
                                    Selected station: {station.name}
                                </h1>
                                {/* Mobile */}
                                <h1 className="invisible mb-4 flex items-center gap-2 font-mono text-base font-semibold max-sm:visible">
                                    <MapPin className="text-primary h-5 w-5" />
                                    <span className="truncate">
                                        {station.name}
                                    </span>
                                </h1>
                            </>
                        ) : (
                            <h1 className="flex items-center gap-2 font-mono text-lg font-bold sm:text-xl md:text-2xl lg:text-3xl">
                                <MapPin className="text-primary h-6 w-6" />
                                Select a station
                            </h1>
                        )}
                    </>
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
