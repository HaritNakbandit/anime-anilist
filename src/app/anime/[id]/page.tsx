"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@apollo/client/react";
import { GET_MEDIA_DETAIL } from "@/api/gql";
import { Star, Clock, CalendarDays, Users, Tv, ExternalLink, ChevronLeft } from "lucide-react";

const formatDuration = (minutes: number | null) => {
  if (!minutes || minutes <= 0) return "—";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0 && m === 0) return `${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m} min`;
};

const formatDate = (date: { year: number | null; month: number | null; day: number | null } | null) => {
  if (!date || !date.year) return "—";
  const parts: string[] = [];
  if (date.day && date.month) parts.push(`${String(date.day).padStart(2, "0")}/${String(date.month).padStart(2, "0")}`);
  else if (date.month) parts.push(String(date.month));
  parts.push(String(date.year));
  return parts.join(" ");
};

const StatCard = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex flex-col gap-1 rounded-xl border border-navy-border bg-white p-3 shadow-sm dark:border-navyDark-border dark:bg-navyDark-paper">
    <span className="text-xs font-semibold uppercase tracking-wide text-navy-textSecondary dark:text-navyDark-textSecondary">{label}</span>
    <span className="text-base font-medium text-navy-textPrimary dark:text-navyDark-textPrimary">{value}</span>
  </div>
);

export default function AnimeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params?.id === "string" ? Number(params.id) : undefined;

  const { loading, error, data } = useQuery(GET_MEDIA_DETAIL, {
    variables: { id },
    skip: !id || Number.isNaN(id),
  });

  useEffect(() => {
    if (error) router.replace("/");
  }, [error, router]);

  if (!id || Number.isNaN(id)) return null;

  const media = data?.Media;

  // Loading state
  if (loading && !media) {
    return (
      <div className="mx-auto w-full max-w-[1200px] animate-pulse px-4 pb-16 pt-6 md:px-8">
        {/* Back */}
        <div className="mb-4 h-5 w-[150px] rounded bg-navy-border dark:bg-navyDark-border" />

        {/* Banner */}
        <div className="mb-6 h-[240px] w-full rounded-2xl bg-navy-border dark:bg-navyDark-border md:h-[320px]" />

        {/* Header: cover + title */}
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="mx-auto aspect-[200/283] w-[200px] shrink-0 rounded-xl bg-navy-border dark:bg-navyDark-border md:mx-0" />

          <div className="flex w-full flex-col gap-3">
            <div className="h-9 w-3/4 rounded bg-navy-border dark:bg-navyDark-border" />
            <div className="h-6 w-2/5 rounded bg-navy-border dark:bg-navyDark-border" />

            {/* Genres */}
            <div className="flex flex-wrap gap-2">
              {Array.from(new Array(3)).map((_, i) => (
                <div key={i} className="h-[26px] w-[71px] rounded-full bg-navy-border dark:bg-navyDark-border" />
              ))}
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from(new Array(8)).map((_, i) => (
                <div key={i} className="h-[72px] rounded-xl bg-navy-border dark:bg-navyDark-border" />
              ))}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-8">
          <div className="mb-3 h-7 w-32 rounded bg-navy-border dark:bg-navyDark-border" />
          <div className="space-y-2">
            <div className="h-[23px] w-full rounded bg-navy-border dark:bg-navyDark-border" />
            <div className="h-[23px] w-full rounded bg-navy-border dark:bg-navyDark-border" />
            <div className="h-[23px] w-2/3 rounded bg-navy-border dark:bg-navyDark-border" />
          </div>
        </div>

        {/* Characters */}
        <div className="mt-8">
          <div className="mb-3 h-7 w-32 rounded bg-navy-border dark:bg-navyDark-border" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {Array.from(new Array(6)).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="h-[120px] w-[96px] rounded-lg bg-navy-border dark:bg-navyDark-border" />
                <div className="h-3 w-16 rounded bg-navy-border dark:bg-navyDark-border" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!media) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center gap-3">
        <p className="text-lg font-semibold text-navy-textPrimary dark:text-navyDark-textPrimary">Anime not found</p>
        <Link href="/" className="text-sm text-navy-primary underline hover:no-underline dark:text-navyDark-primary">← Back to home</Link>
      </div>
    );
  }

  const title = media.title?.english || media.title?.romaji || "Untitled";
  const nativeTitle = media.title?.native;
  const genres: string[] = (media.genres ?? []).filter(Boolean) as string[];
  
  const characters = media.characters?.edges?.map((e) => ({
    role: e.role,
    name: e.node?.name?.full,
    image: e.node?.image?.large
  }))?.filter((c): c is { role: string | null; name: string | null; image: string | null } => !!c.name);

  const staff = media.staff?.edges?.map((e) => ({
    role: e.role,
    name: e.node?.name?.full
  }))?.filter((s): s is { role: string | null; name: string | null } => !!s.name);
  
  const streaming = (media.streamingEpisodes ?? []).filter((s) => !!s.url && !!s.title);

  // Next season from relations - find ANIME type with SEQUEL relationType
  let nextSeasonId: string | null = null;
  let nextSeasonTitle: string | null = null;
  if (media.relations?.edges?.length) {
    const sequelEdge = media.relations.edges.find((e) => e.node.type === "ANIME" && e.relationType === "SEQUEL");
    if (sequelEdge) {
      nextSeasonId = sequelEdge.node.id;
      nextSeasonTitle = sequelEdge.node.title?.english || sequelEdge.node.title?.romaji;
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 pb-16 pt-6 md:px-8">
      {/* Back */}
      <Link href="/" className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-navy-textSecondary transition-colors hover:text-navy-primary dark:text-navyDark-textSecondary dark:hover:text-navyDark-primary">
        <ChevronLeft className="h-4 w-4" /> Back to home
      </Link>

      {/* Banner */}
      {media.bannerImage && (
        <div className="relative mb-6 overflow-hidden rounded-2xl shadow-lg">
          <img src={media.bannerImage} alt={`${title} banner`} className="h-[240px] w-full object-cover md:h-[320px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        </div>
      )}

      {/* Header: cover + title */}
      <div className="flex flex-col gap-6 md:flex-row">
        {media.coverImage?.extraLarge && (
          <img
            src={media.coverImage.extraLarge}
            alt={title}
            className="mx-auto w-[200px] shrink-0 rounded-xl shadow-lg md:mx-0"
          />
        )}

        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-navy-textPrimary dark:text-navyDark-textPrimary">{title}</h1>
          {nativeTitle && nativeTitle !== title && (
            <p className="text-base text-navy-textSecondary dark:text-navyDark-textSecondary">{nativeTitle}</p>
          )}

          {/* Genres */}
          {genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {genres.map((g) => (
                <span key={g} className="rounded-full border border-navy-border bg-white px-3 py-1 text-xs font-medium text-navy-textPrimary shadow-sm dark:border-navyDark-border dark:bg-navyDark-paper dark:text-navyDark-textPrimary">
                  {g}
                </span>
              ))}
            </div>
          )}

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <StatCard label="Score" value={media.averageScore ? (
              <span className="inline-flex items-center gap-1"><Star className="h-4 w-4 fill-[#fbbf24] text-[#fbbf24]" />{(media.averageScore / 10).toFixed(1)}</span>
            ) : "—"} />
            <StatCard label="Episodes" value={media.episodes ?? "—"} />
            <StatCard label="Status" value={media.status ?? "—"} />
            <StatCard label="Format" value={media.format ?? "—"} />
            <StatCard label="Season" value={media.season ? `${media.season} ${media.seasonYear ?? ""}`.trim() : "—"} />
            <StatCard label="Duration" value={formatDuration(media.duration)} />
            <StatCard label="Starts" value={formatDate(media.startDate)} />
            <StatCard label="Ends" value={formatDate(media.endDate)} />
          </div>

          {/* Source + site */}
          {(media.source || media.siteUrl) && (
            <div className="flex flex-wrap gap-3 text-sm">
              {media.source && (
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-navy-border bg-white px-3 py-1.5 font-medium text-navy-textPrimary shadow-sm dark:border-navyDark-border dark:bg-navyDark-paper dark:text-navyDark-textPrimary">
                  <Tv className="h-4 w-4" /> {media.source}
                </span>
              )}
              {media.siteUrl && (
                <a href={media.siteUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-navy-border bg-white px-3 py-1.5 font-medium text-navy-textPrimary shadow-sm transition-colors hover:text-navy-primary dark:border-navyDark-border dark:bg-navyDark-paper dark:text-navyDark-textPrimary dark:hover:text-navyDark-primary">
                  <ExternalLink className="h-4 w-4" /> Official site
                </a>
              )}
            </div>
          )}

          {/* Next season */}
          {nextSeasonId && nextSeasonTitle && (
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-navy-textSecondary dark:text-navyDark-textSecondary">Next season:</span>
              <Link href={`/anime/${nextSeasonId}`} className="font-medium text-navy-primary underline hover:no-underline dark:text-navyDark-primary">
                {nextSeasonTitle}
              </Link>
            </div>
          )}

          {/* Popularity / favourites */}
          {(media.popularity || media.favourites) && (
            <div className="flex flex-wrap gap-4 text-sm text-navy-textSecondary dark:text-navyDark-textSecondary">
              {media.popularity && (
                <span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4" /> Popularity: {media.popularity.toLocaleString()}</span>
              )}
              {media.favourites && (
                <span className="inline-flex items-center gap-1.5"><Star className="h-4 w-4" /> Favourites: {media.favourites.toLocaleString()}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {media.description && (
        <section className="mt-8">
          <h2 className="mb-3 text-xl font-bold tracking-tight text-navy-textPrimary dark:text-navyDark-textPrimary">Synopsis</h2>
          <p
            className="whitespace-pre-line text-sm leading-relaxed text-navy-textPrimary/90 dark:text-navyDark-textPrimary/90"
            dangerouslySetInnerHTML={{ __html: media.description }}
          />
        </section>
      )}

      {/* Streaming */}
      {streaming.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-xl font-bold tracking-tight text-navy-textPrimary dark:text-navyDark-textPrimary">Streaming</h2>
          <div className="flex flex-wrap gap-3">
            {streaming.map((s, i) => (
              <a key={i} href={s.url ?? undefined} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-navy-border bg-white px-3 py-2 text-sm font-medium text-navy-textPrimary shadow-sm transition-colors hover:text-navy-primary dark:border-navyDark-border dark:bg-navyDark-paper dark:text-navyDark-textPrimary dark:hover:text-navyDark-primary">
                <Tv className="h-4 w-4" /> {s.title}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Characters */}
      {characters && characters.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-xl font-bold tracking-tight text-navy-textPrimary dark:text-navyDark-textPrimary">Characters</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {characters.map((c, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                {c.image && (
                  <img src={c.image} alt={c.name ?? ""} loading="lazy" className="h-[120px] w-[96px] rounded-lg object-cover shadow-md" />
                )}
                <p className="mt-2 line-clamp-2 text-sm font-semibold leading-snug text-navy-textPrimary dark:text-navyDark-textPrimary">{c.name}</p>
                {c.role && (
                  <p className="text-xs text-navy-textSecondary dark:text-navyDark-textSecondary">{c.role}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Staff */}
      {staff && staff.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-xl font-bold tracking-tight text-navy-textPrimary dark:text-navyDark-textPrimary">Staff</h2>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {staff.map((s, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-navy-border bg-white px-3 py-2 shadow-sm dark:border-navyDark-border dark:bg-navyDark-paper">
                <span className="text-xs font-semibold uppercase tracking-wide text-navy-textSecondary dark:text-navyDark-textSecondary">{s.role}</span>
                <span className="truncate pl-3 text-sm font-medium text-navy-textPrimary dark:text-navyDark-textPrimary">{s.name}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Duration / source fallback */}
      {!media.duration && !media.source && (
        <p className="mt-8 flex items-center gap-2 text-sm text-navy-textSecondary dark:text-navyDark-textSecondary">
          <Clock className="h-4 w-4" /> No duration info available.
        </p>
      )}

      {/* Season year fallback */}
      {!media.seasonYear && (
        <p className="mt-2 flex items-center gap-2 text-sm text-navy-textSecondary dark:text-navyDark-textSecondary">
          <CalendarDays className="h-4 w-4" /> No season info available.
        </p>
      )}
    </div>
  );
}