"use client";

import Autocomplete from "@/components/Autocomplete";

export default function Home() {
    return (
        <main className="p-4">
            <h1 className="mb-4 text-2xl font-bold">Sélecteur de station 🚐</h1>
            <Autocomplete
                onSelect={(station) => {
                    console.log("Station sélectionnée :", station);
                }}
            />
        </main>
    );
}
