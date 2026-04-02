"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { MaterialIcon } from "@/components/ui/material-icon";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full w-10 h-10 bg-surface text-on-surface hover:bg-surface-variant focus:ring-2 focus:ring-primary/50 transition-all border border-outline-variant"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      title="Toggle theme"
    >
      <div className="relative flex items-center justify-center w-full h-full">
        {/* Sun Icon for Light Mode */}
        <span
          className={`absolute transition-all duration-300 ${
            theme === "dark" ? "scale-0 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
          }`}
        >
          <MaterialIcon name="light_mode" />
        </span>

        {/* Moon Icon for Dark Mode */}
        <span
          className={`absolute transition-all duration-300 ${
            theme === "dark" ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-90 opacity-0"
          }`}
        >
          <MaterialIcon name="dark_mode" />
        </span>
      </div>
    </Button>
  );
}
