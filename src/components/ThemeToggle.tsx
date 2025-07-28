"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    const isDark = theme === "dark";

    return (
        <Button
            variant={"outline"}
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="hover:bg-muted rounded-full p-2"
            aria-label="Toggle Theme"
        >
            {isDark ? (
                <Sun className="lucide lucide-sun h-4 w-4" />
            ) : (
                <Moon className="lucide lucide-moon h-4 w-4" />
            )}
        </Button>
    );
}
