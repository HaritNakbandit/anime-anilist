"use client";

import React, { useEffect, useState } from "react";
import { ASSET_PREFIX } from "@/utils";

interface Props {
  visible: boolean;
}

export default function LoadingScreen({ visible }: Props) {
  const [progress, setProgress] = useState(0);
  const [fadingOut, setFadingOut] = useState(false);

  // Simulate progress while loading (caps at 95% until parent hides the screen).
  useEffect(() => {
    if (!visible) return;
    let current = 0;
    const interval = setInterval(() => {
      current += Math.random() * 12 + 3;
      setProgress(Math.min(current, 95));
    }, 400);
    return () => clearInterval(interval);
  }, [visible]);

  // When the parent hides us (data loaded), animate to 100% then fade out.
  useEffect(() => {
    if (visible) return;
    setProgress(100);
    const t = setTimeout(() => setFadingOut(true), 300);
    return () => clearTimeout(t);
  }, [visible]);

  // Fully unmount after the fade-out transition completes.
  useEffect(() => {
    if (!fadingOut) return;
    const t = setTimeout(() => setProgress(0), 500);
    return () => clearTimeout(t);
  }, [fadingOut]);

  if (visible || !fadingOut) {
    return (
      <div
        data-splash-screen
        className={`fixed inset-0 z-[2000] flex items-center justify-center overflow-hidden bg-navy-light transition-opacity duration-500 dark:bg-navyDark-bg ${
          fadingOut ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Ambient glow blobs */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-navy-primary/30 blur-3xl dark:bg-navyDark-primary/20" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-navy-secondary/30 blur-3xl dark:bg-navyDark-secondary/20" />

        <div className="relative flex w-full max-w-xs flex-col items-center gap-6 px-6">
          {/* Logo with spinning ring + glow */}
          <div className="relative flex h-24 w-24 items-center justify-center">
            <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-navy-primary border-r-navy-secondary [animation-duration:1.4s] dark:border-t-navyDark-primary dark:border-r-navyDark-secondary" />
            <img
              src={`${ASSET_PREFIX}/app-icon.png`}
              alt="Anime Anilist"
              className="relative h-16 w-16 rounded-2xl shadow-lg"
            />
          </div>

          {/* Title */}
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-xl font-bold tracking-tight text-navy-textPrimary dark:text-navyDark-textPrimary">
              Anime Anilist
            </h1>
            <p className="text-xs text-navy-textSecondary dark:text-navyDark-textSecondary">
              Discovering anime for you…
            </p>
          </div>

          {/* Progress bar */}
          <div className="flex w-full flex-col items-center gap-2">
            <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-navy-border dark:bg-navyDark-border">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-navy-primary to-navy-secondary transition-all duration-300 ease-out dark:from-navyDark-primary dark:to-navyDark-secondary"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs font-medium tabular-nums text-navy-textSecondary dark:text-navyDark-textSecondary">
              {Math.round(progress)}%
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
