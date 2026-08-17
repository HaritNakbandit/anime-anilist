"use client";

import { Star } from "lucide-react";
import Link from "next/link";
import type { MediaData } from "@/app/interface";

interface Props {
  item: MediaData;
}

const Card = ({ item }: Props) => {
  const { id, coverImage, title, averageScore } = item;

  const displayTitle = title?.english ?? title?.romaji;
  const score = averageScore ? averageScore / 10 : undefined;

  return (
    <Link href={`/anime?id=${id}`} className="group relative block w-full cursor-pointer">
      <div className="overflow-hidden rounded-xl border border-navy-border bg-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg dark:border-navyDark-border dark:bg-navyDark-paper">
        <img
          src={coverImage?.extraLarge}
          alt={displayTitle}
          className="aspect-[61/75] w-full object-cover"
          loading="lazy"
        />
        {score && score > 0 && (
          <div className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            <Star className="h-3.5 w-3.5 fill-[#fbbf24] text-[#fbbf24]" />
            <span>{score.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Tooltip: title shows on hover only */}
      <div className="pointer-events-none absolute -top-2 left-1/2 z-20 w-max max-w-[200px] -translate-x-1/2 -translate-y-full rounded-lg bg-navy-primary px-3 py-1.5 text-center text-xs font-semibold leading-snug text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 dark:bg-navyDark-secondary">
        {displayTitle}
        <div className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-navy-primary dark:bg-navyDark-secondary" />
      </div>
    </Link>
  );
};

export default Card;
