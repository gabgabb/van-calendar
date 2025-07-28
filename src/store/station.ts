import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Station } from "@/lib/types";

type StationStore = {
    selectedStation: Station | null;
    setStation: (station: Station | null) => void;
    hasHydrated: boolean;
    setHasHydrated: (hydrated: boolean) => void;
};

export const useStationStore = create<StationStore>()(
    persist(
        (set) => ({
            selectedStation: null,
            setStation: (station) => set(() => ({ selectedStation: station })),
            hasHydrated: false,
            setHasHydrated: (hydrated: boolean) =>
                set(() => ({ hasHydrated: hydrated })),
        }),
        {
            name: "station-storage",
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        },
    ),
);
