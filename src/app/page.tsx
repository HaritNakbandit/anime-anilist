"use client";

import React, { useCallback, useRef, useState, useEffect, useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_MEDIA } from "@/api/gql";
import { Input, InputSelect, Card, CardLoading, CardDetailed, CardDetailedLoading, LoadingScreen } from "@/components/ui";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MediaData, Options, PageResponse } from "./interface";
import { getCurrentSeason } from "@/utils";
import moment from "moment";
import { Search, LayoutGrid, Rows3 } from "lucide-react";

let optionYear: Options[] = [];
const currentYear = moment().year();

for (let i = currentYear; i >= 1960; i--) {
  optionYear.push({ value: i.toString(), label: i.toString() });
}

// Season options with default based on current month
const optionSeason: Options[] = [
  { value: "WINTER", label: "Winter" },
  { value: "SPRING", label: "Spring" },
  { value: "SUMMER", label: "Summer" },
  { value: "FALL", label: "Fall" },
];

const VIEW_MODE_KEY = "animeAnilist:viewMode";
const SPLASH_SEEN_KEY = "animeAnilist:splashSeen";

export default function Home() {
  const limit = 18;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [page, setPage] = useState<number>(1);
  const [dataList, setDataList] = useState<MediaData[]>([]);
  const [viewMode, setViewMode] = useState<"simple" | "detailed">("simple");

  // Load the saved view mode once on mount (after hydration, so SSR/client markup still match).
  useEffect(() => {
    const saved = localStorage.getItem(VIEW_MODE_KEY);
    if (saved === "simple" || saved === "detailed") setViewMode(saved);
  }, []);

  const handleViewModeChange = (mode: "simple" | "detailed") => {
    setViewMode(mode);
    localStorage.setItem(VIEW_MODE_KEY, mode);
  };
  // Draft state: what the user has typed in the input (not yet applied).
  const [inputSearch, setInputSearch] = useState<string>(
    searchParams.get("search") ?? ""
  );
  // Draft state: what the user has picked in the UI (not yet applied).
  const [selectYear, setSelectYear] = useState<Options | null>(
    optionYear.find((o) => o.value === currentYear.toString()) ?? null
  );
  const [selectSeason, setSelectSeason] = useState<Options | null>(
    getCurrentSeason(optionSeason)
  );

  // Applied state: what the query actually uses. Updated only when Search is pressed.
  // On first load, defaults to the current draft values (year/season/search) so
  // the initial fetch matches what's shown in the UI.
  const [appliedYear, setAppliedYear] = useState<string | undefined>(
    searchParams.get("year") ?? currentYear.toString()
  );
  const [appliedSeason, setAppliedSeason] = useState<string | undefined>(
    searchParams.get("season") ?? getCurrentSeason(optionSeason)?.value
  );
  const [appliedSearch, setAppliedSearch] = useState<string>(
    searchParams.get("search") ?? ""
  );

  const titleDetail = useMemo(() => {
    const seasonLabel =
      optionSeason.find((s) => s.value === appliedSeason)?.label ?? "All";
    const yearLabel = appliedYear ?? "All";
    return `${seasonLabel}-${yearLabel}`;
  }, [appliedSeason, appliedYear]);

  const handleClearData = () => {
    setPage(1);
    setDataList([]);
    appendedPageRef.current = 0;
  };

  // Select changes only update the draft state — query is NOT refetched yet.
  const handleYearChange = (value: string) => {
    setSelectYear(
      optionYear.find((o) => o.value === value) ?? null
    );
  };

  const handleSeasonChange = (value: string) => {
    setSelectSeason(optionSeason.find((o) => o.value === value) ?? null);
  };

  // Pressing Search applies all current drafts to the query + URL.
  const handleSearchSubmit = () => {
    const yearValue = selectYear?.value;
    const seasonValue = selectSeason?.value;
    const searchValue = inputSearch.trim();

    setAppliedYear(yearValue);
    setAppliedSeason(seasonValue);
    setAppliedSearch(searchValue);

    const params = new URLSearchParams();
    if (yearValue) params.set("year", yearValue);
    if (seasonValue) params.set("season", seasonValue);
    if (searchValue) params.set("search", searchValue);
    router.replace(`${pathname}?${params.toString()}`);
    handleClearData();
  };

  const { loading, data } = useQuery(GET_MEDIA, {
    variables: {
      limit: limit,
      page: page,
      year: appliedYear ? Number(appliedYear) : undefined,
      season: appliedSeason,
      search: !!appliedSearch ? appliedSearch : undefined,
      format: "TV",
      sort: "POPULARITY_DESC",
    },
  });

  // Guards against appending the same page twice (e.g. React Strict Mode's
  // double effect invocation in dev, or `data` changing reference without
  // the page actually advancing).
  const appendedPageRef = useRef<number>(0);

  useEffect(() => {
    if (data && data.Page && data.Page.media.length > 0 && appendedPageRef.current !== page) {
      appendedPageRef.current = page;
      setDataList((prev) => [...prev, ...data.Page.media]);
    }
  }, [data, page]);

  const hasNextPage = !!data?.Page?.pageInfo?.hasNextPage;

  // Splash screen: shown on the initial load only, hidden once the first query
  // settles. A minimum display time prevents it from flashing on fast loads.
  // Only shown once per browser session (tab) — repeat visits are hidden
  // instantly via the blocking inline script in layout.tsx (see splash-seen
  // class), not via this state, to avoid a hydration-mismatch flash.
  const [splashVisible, setSplashVisible] = useState(true);
  const mountedAtRef = useRef(Date.now());

  useEffect(() => {
    if (loading || !splashVisible) return;
    const minRemaining = Math.max(0, 1000 - (Date.now() - mountedAtRef.current));
    const t = setTimeout(() => {
      setSplashVisible(false);
      sessionStorage.setItem(SPLASH_SEEN_KEY, "1");
    }, minRemaining);
    return () => clearTimeout(t);
  }, [loading, splashVisible]);

  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-col items-center px-4 pb-16 pt-6 md:px-8">
      <LoadingScreen visible={splashVisible} />

      {/* Title */}
      <div className="mb-4 flex w-full flex-col items-center justify-between gap-3 md:flex-row">
        <h2 className="text-3xl font-bold tracking-tight text-navy-textPrimary dark:text-navyDark-textPrimary">{`Anime ${titleDetail}`}</h2>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 rounded-full border border-navy-border bg-white p-1 dark:border-navyDark-border dark:bg-navyDark-paper">
          <button
            type="button"
            onClick={() => handleViewModeChange("simple")}
            aria-pressed={viewMode === "simple"}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              viewMode === "simple"
                ? "bg-navy-primary text-white dark:bg-navyDark-secondary"
                : "text-navy-textSecondary hover:text-navy-textPrimary dark:text-navyDark-textSecondary dark:hover:text-navyDark-textPrimary"
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            Simple
          </button>
          <button
            type="button"
            onClick={() => handleViewModeChange("detailed")}
            aria-pressed={viewMode === "detailed"}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              viewMode === "detailed"
                ? "bg-navy-primary text-white dark:bg-navyDark-secondary"
                : "text-navy-textSecondary hover:text-navy-textPrimary dark:text-navyDark-textSecondary dark:hover:text-navyDark-textPrimary"
            }`}
          >
            <Rows3 className="h-3.5 w-3.5" />
            Detailed
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex w-full flex-col gap-3 sm:flex-row">
        <InputSelect
          id="input-select-year"
          label="Year"
          field="year"
          options={optionYear}
          value={selectYear}
          onChange={handleYearChange}
          setState={setSelectYear}
        />
        <InputSelect
          id="input-select-season"
          label="Season"
          field="season"
          options={optionSeason}
          value={selectSeason}
          onChange={handleSeasonChange}
          setState={setSelectSeason}
          hasPlaceholder={false}
        />
        <div className="flex flex-col gap-1 sm:w-[300px]">
          <span className="text-xs font-semibold uppercase tracking-wide text-navy-textSecondary dark:text-navyDark-textSecondary">Search</span>
          <Input
            id="input-search"
            label="Search"
            field="search"
            value={inputSearch}
            onChange={(v: string) => setInputSearch(v)}
            setState={setInputSearch}
            onSubmit={handleSearchSubmit}
          />
        </div>
      </div>

      {/* Grid */}
      <div
        className={`grid w-full gap-x-4 gap-y-6 pt-8 md:gap-x-5 ${
          viewMode === "simple" ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6" : "grid-cols-1 md:grid-cols-2"
        }`}
      >
        {(dataList ?? [])?.map((item: MediaData) =>
          viewMode === "simple" ? (
            <Card key={`animate-card-${item.id}`} item={item} />
          ) : (
            <CardDetailed key={`animate-card-${item.id}`} item={item} />
          )
        )}
        {loading &&
          Array.from(new Array(limit))?.map((_, index: number) =>
            viewMode === "simple" ? (
              <CardLoading key={`animate-card-loading-${index + 1}`} />
            ) : (
              <CardDetailedLoading key={`animate-card-loading-${index + 1}`} />
            )
          )}
      </div>
      {!loading && dataList?.length <= 0 ? (
        <Typography variant="h5" align="center">
          No Results
        </Typography>
      ) : (
        <>
          {!loading && hasNextPage && (
            <button
              onClick={() => {
                setPage((prev) => prev + 1);
              }}
              className="mt-8 h-11 rounded-full bg-navy-primary px-8 text-sm font-semibold text-white shadow-lg transition-shadow hover:shadow-xl dark:bg-navyDark-secondary"
            >
              More
            </button>
          )}
          {!loading && !hasNextPage && dataList?.length > 0 && (
            <p className="mt-10 text-sm text-navy-textSecondary dark:text-navyDark-textSecondary">
              No more anime to load.
            </p>
          )}
        </>
      )}
    </main>
  );
}