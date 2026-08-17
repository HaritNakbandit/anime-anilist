const CardDetailedLoading = () => {
  return (
    <div className="flex w-full animate-pulse flex-col overflow-hidden rounded-xl border border-navy-border bg-white shadow-sm dark:border-navyDark-border dark:bg-navyDark-paper">
      {/* Header — same structure/heights as CardDetailed's title block (min-h-[2.5rem] title + genre line) */}
      <div className="border-b border-navy-border px-4 py-3 text-center dark:border-navyDark-border">
        <div className="mx-auto h-10 w-3/4 rounded bg-navy-border dark:bg-navyDark-border" />
        <div className="mx-auto mt-1 h-4 w-1/2 rounded bg-navy-border dark:bg-navyDark-border" />
      </div>

      <div className="flex flex-1">
        {/* Image — same aspect ratio as the real AniList cover, which is what actually sets the row's height */}
        <div
          className="w-[140px] shrink-0 bg-navy-border dark:bg-navyDark-border"
          style={{ aspectRatio: "230/326" }}
        />

        {/* Info column */}
        <div className="flex flex-1 flex-col divide-y divide-navy-border dark:divide-navyDark-border">
          <div className="px-3 py-2">
            <div className="mx-auto h-3 w-1/2 rounded bg-navy-border dark:bg-navyDark-border" />
          </div>
          <div className="px-3 py-2">
            <div className="mx-auto h-3 w-2/3 rounded bg-navy-border dark:bg-navyDark-border" />
          </div>
          <div className="flex flex-col gap-1.5 px-3 py-2">
            <div className="h-2.5 w-full rounded bg-navy-border dark:bg-navyDark-border" />
            <div className="h-2.5 w-full rounded bg-navy-border dark:bg-navyDark-border" />
            <div className="h-2.5 w-5/6 rounded bg-navy-border dark:bg-navyDark-border" />
            <div className="h-2.5 w-2/3 rounded bg-navy-border dark:bg-navyDark-border" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetailedLoading;
