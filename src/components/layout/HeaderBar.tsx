"use client";

import React from "react";
import { useContext } from "react";
import { ColorModeContext, type ThemeContextValue } from "@/theme/Theme";
import { Moon, Sun } from "lucide-react";
import { ASSET_PREFIX } from "@/utils";

export default function HeaderBar() {
  const { mode, toggleColorMode } = useContext(ColorModeContext) as ThemeContextValue;
  const [isScrolled, setIsScrolled] = React.useState(false);

  // Local state that only updates after mount to avoid hydration mismatch.
  // SSR and initial client render both show Sun (light); after mount we sync
  // with the actual theme from context/DOM.
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isLight = mounted ? mode === "light" : true;

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 flex w-full border-b border-navy-border bg-navy-light/90 backdrop-blur-md transition-transform duration-300 ease-out dark:border-navyDark-border dark:bg-navyDark-bg/90"
      style={{ transform: isScrolled ? "translateY(-100%)" : "translateY(0)" }}
    >
      <div className="mx-auto flex h-[64px] w-full max-w-[1200px] items-center justify-between gap-2 px-4 md:px-8">
        {/* Logo + Title */}
        <a href="/" className="flex items-center gap-3">
          <img src={`${ASSET_PREFIX}/app-icon.png`} alt="Anime Anilist" className="h-9 w-9 shrink-0 rounded-xl shadow-sm" />
          <span className="bg-gradient-to-r from-navy-primary to-navy-secondary bg-clip-text text-lg font-bold tracking-tight text-transparent">
            Anime Anilist
          </span>
        </a>

        {/* Theme Toggle */}
        <button
          onClick={toggleColorMode}
          aria-label="Toggle theme"
          className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${isLight ? "text-navy-textPrimary hover:bg-navy-light" : "text-navyDark-primary hover:bg-white/10"}`}
        >
          {isLight ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>
    </header>
  );
}