"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useStationStore } from "@/store/station";
import { Station } from "@/lib/types";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";

export default function Autocomplete() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Station[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const hasSelectedRef = useRef(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const selectedStation = useStationStore((s) => s.selectedStation);
    const setStation = useStationStore((s) => s.setStation);

    useEffect(() => {
        if (selectedStation?.name) {
            setQuery(selectedStation.name);
        }
    }, [selectedStation]);

    useEffect(() => {
        if (query.length < 1) {
            setResults([]);
            setHasSearched(false);
            return;
        }

        if (query === selectedStation?.name) {
            return;
        }

        if (hasSelectedRef.current) {
            hasSelectedRef.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            setLoading(true);
            setHasSearched(true);

            const url = `${process.env.API_URL}/stations?search=${encodeURIComponent(query)}`;

            fetch(url)
                .then((res) => res.json())
                .then((data) => setResults(Array.isArray(data) ? data : []))
                .catch(() => setResults([]))
                .finally(() => setLoading(false));
        }, 300);

        return () => clearTimeout(timeout);
    }, [query, selectedStation]);

    const handleSelect = (station: Station) => {
        setStation(station);
        setQuery(station.name);
        setResults([]);
        setHasSearched(false);
        hasSelectedRef.current = true;
    };

    const handleClear = () => {
        setQuery("");
        setResults([]);
        setHasSearched(false);
        setStation(null);
        toast.success("Station selection cleared");
    };

    const handleFocus = () => {
        if (query.length > 0 && query !== selectedStation?.name) {
            setHasSearched(true);
            setLoading(true);

            const url = `${process.env.API_URL}/stations?search=${encodeURIComponent(query)}`;

            fetch(url)
                .then((res) => res.json())
                .then((data) => setResults(Array.isArray(data) ? data : []))
                .catch(() => setResults([]))
                .finally(() => setLoading(false));
        }
    };

    const filteredResults = results.filter((s) => s.id !== selectedStation?.id);

    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (
            containerRef.current &&
            !containerRef.current.contains(event.target as Node)
        ) {
            setResults([]);
            setHasSearched(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [handleClickOutside]);

    return (
        <Command
            className="relative flex w-full max-w-md items-center border font-mono shadow"
            ref={containerRef}
        >
            <div className="flex w-full">
                <CommandInput
                    ref={inputRef}
                    placeholder="Search a station..."
                    value={query}
                    onValueChange={(val) => setQuery(val)}
                    onFocus={handleFocus}
                />
                {(query || selectedStation) && (
                    <button
                        onClick={handleClear}
                        className="cursor-pointer p-1"
                        aria-label="Clear"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            <div className="bg-background absolute top-full left-1/2 z-20 w-full -translate-x-1/2 rounded-md border shadow-sm">
                {loading && hasSearched && (
                    <div className="flex justify-center p-2">
                        <Loader2 className="text-chart-3 size-6 animate-spin" />
                    </div>
                )}

                {!loading && filteredResults.length > 0 && (
                    <CommandGroup>
                        {filteredResults.map((station) => (
                            <CommandItem
                                key={station.id}
                                onSelect={() => handleSelect(station)}
                            >
                                {station.name}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                )}

                {!loading && hasSearched && filteredResults.length === 0 && (
                    <CommandEmpty className="bg-background rounded-md border p-2">
                        No results found.
                    </CommandEmpty>
                )}
            </div>
        </Command>
    );
}
