"use client";

import { useEffect, useState } from "react";

type Station = {
    id: string;
    name: string;
};

interface AutocompleteProps {
    onSelect: (station: Station) => void;
}

export default function Autocomplete({ onSelect }: AutocompleteProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Station[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    useEffect(() => {
        if (query.length < 2) return;

        const timer = setTimeout(() => {
            setLoading(true);
            setHasSearched(true);

            fetch(
                `${process.env.API_URL}/stations?search=${encodeURIComponent(query)}`,
            )
                .then(async (res) => {
                    if (!res.ok) {
                        return [];
                    }
                    const data = await res.json();
                    return Array.isArray(data) ? data : [];
                })
                .then((data: Station[]) => {
                    setResults(data);
                    setLoading(false);
                })
                .catch(() => {
                    setResults([]);
                    setLoading(false);
                });
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    useEffect(() => {
        if (query.length === 0) {
            setHasSearched(false);
            setResults([]);
        }
    }, [query]);

    return (
        <div className="relative w-full max-w-md">
            <input
                type="text"
                className="w-full rounded border border-gray-300 p-2"
                placeholder="Search a station..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />

            {loading && (
                <p className="mt-1 text-sm text-gray-500">Loading...</p>
            )}

            {!loading && results.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full rounded border border-gray-300 bg-white shadow-md">
                    {results.map((station) => (
                        <li
                            key={station.id}
                            className="cursor-pointer p-2 hover:bg-blue-100"
                            onClick={() => {
                                onSelect(station);
                                setQuery(station.name);
                                setResults([]);
                            }}
                        >
                            {station.name}
                        </li>
                    ))}
                </ul>
            )}

            {!loading && hasSearched && results.length === 0 && (
                <p className="mt-1 text-sm text-gray-500">
                    No results found for "{query}"
                </p>
            )}
        </div>
    );
}
