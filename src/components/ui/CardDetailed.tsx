"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import Link from "next/link";
import moment from "moment";
import type { MediaData } from "@/app/interface";

interface Props {
  item: MediaData;
}

const formatCountdown = (totalSeconds: number) => {
  const d = Math.floor(totalSeconds / 86400);
  const h = Math.floor((totalSeconds % 86400) / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${d}d ${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
};

const CardDetailed = ({ item }: Props) => {
  const {
    id,
    coverImage,
    title,
    averageScore,
    genres,
    format,
    episodes,
    duration,
    source,
    countryOfOrigin,
    studios,
    nextAiringEpisode,
    description,
  } = item;

  const displayTitle = title?.english ?? title?.romaji;
  const score = averageScore ? averageScore / 10 : undefined;
  const studioName = studios?.nodes?.[0]?.name;
  const genreLine = (genres ?? []).filter(Boolean).join(" · ");
  const metaLine = [source, episodes ? `${episodes} eps${duration ? ` × ${duration}m` : ""}` : null]
    .filter(Boolean)
    .join("    ");

  const [secondsLeft, setSecondsLeft] = useState<number | null>(nextAiringEpisode?.timeUntilAiring ?? null);

  useEffect(() => {
    if (nextAiringEpisode?.timeUntilAiring == null) {
      setSecondsLeft(null);
      return;
    }
    setSecondsLeft(nextAiringEpisode.timeUntilAiring);
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [nextAiringEpisode?.timeUntilAiring]);

  return (
    <Link
      href={`/anime/${id}`}
      className="flex w-full cursor-pointer flex-col overflow-hidden rounded-xl border border-navy-border bg-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg dark:border-navyDark-border dark:bg-navyDark-paper"
    >
      <div className="border-b border-navy-border bg-navy-primary px-4 py-3 text-center dark:border-navyDark-border dark:bg-black/40">
        <h3
          className="min-h-[2.5rem] text-base font-bold leading-tight text-white dark:text-navyDark-primary"
          style={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
            overflow: "hidden",
          }}
        >
          {displayTitle}
        </h3>
        {genreLine && (
          <p className="mt-1 truncate text-xs text-white/70 dark:text-navyDark-textSecondary">
            {genreLine}
          </p>
        )}
      </div>

      <div className="flex flex-1">
        <div className="relative w-[140px] shrink-0">
          <img
            src={coverImage?.extraLarge}
            alt={displayTitle}
            className="h-full w-full object-cover"
            loading="lazy"
          />

          {(episodes || format) && (
            <div className="absolute inset-x-0 top-0 z-10 bg-black/70 px-2 py-1 text-center text-[11px] font-semibold leading-tight text-white">
              <div>
                {episodes ? `EP${episodes}` : format}
                {format && ` · ${format}${countryOfOrigin ? ` (${countryOfOrigin})` : ""}`}
              </div>
              {secondsLeft !== null && secondsLeft > 0 && <div>{formatCountdown(secondsLeft)}</div>}
            </div>
          )}

          {score && score > 0 && (
            <div className="absolute bottom-1 left-1 z-10 flex items-center gap-1 rounded-full bg-black/55 px-1.5 py-0.5 text-[11px] font-semibold text-white">
              <Star className="h-3 w-3 fill-[#fbbf24] text-[#fbbf24]" />
              <span>{score.toFixed(2)}</span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col divide-y divide-navy-border text-xs dark:divide-navyDark-border">
          {studioName && (
            <div className="px-3 py-2 text-center font-semibold text-navy-secondary dark:text-navyDark-primary">
              {studioName}
            </div>
          )}
          {nextAiringEpisode?.airingAt && (
            <div className="px-3 py-2 text-center text-navy-textPrimary dark:text-navyDark-textPrimary">
              {moment.unix(nextAiringEpisode.airingAt).format("MMM D, YYYY [at] h:mma")}
            </div>
          )}
          {metaLine && (
            <div className="px-3 py-2 text-center text-navy-textSecondary dark:text-navyDark-textSecondary">
              {metaLine}
            </div>
          )}
          {description && (
            <div
              className="max-h-28 overflow-hidden px-3 py-2 leading-relaxed text-navy-textPrimary/90 dark:text-navyDark-textPrimary/90"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}
        </div>
      </div>
    </Link>
  );
};

export default CardDetailed;
