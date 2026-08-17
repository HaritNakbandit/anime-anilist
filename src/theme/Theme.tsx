"use client";

import React, { useState, useMemo, createContext, useEffect } from "react";

type ThemeContextValue = {
  mode: Mode;
  toggleColorMode: () => void;
};

export type { ThemeContextValue };

export const ColorModeContext = createContext<ThemeContextValue>({
  mode: "light",
  toggleColorMode: () => {},
});

type Mode = "light" | "dark";

const Theme = (props: { children: React.ReactNode }) => {
  const { children } = props;

  // Always start as "light" so SSR HTML and client hydration match.
  // The pre-hydration script in layout.tsx applies the saved theme to <html>
  // before React renders; we sync state after mount via useEffect below.
  const [mode, setMode] = useState<Mode>("light");

  const colorMode = useMemo<ThemeContextValue>(
    () => ({
      mode,
      toggleColorMode: () => {
        const nextTheme: Mode = mode === "light" ? "dark" : "light";
        localStorage.setItem("theme", nextTheme);
        document.documentElement.classList.toggle("dark", nextTheme === "dark");
        setMode(nextTheme);
      },
    }),
    [mode]
  );

  // Sync React state with the theme applied by the pre-hydration script.
  // Runs after hydration so it won't cause a mismatch warning.
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setMode(isDark ? "dark" : "light");
  }, []);

  return <ColorModeContext.Provider value={colorMode}>{children}</ColorModeContext.Provider>;
};

export default Theme;