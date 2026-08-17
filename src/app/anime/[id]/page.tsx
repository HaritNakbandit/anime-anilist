import AnimeDetailClient from "./AnimeDetailClient";

// The AniList catalog is unbounded, so we can't pre-render every possible id
// for a static export — "output: export" requires at least one, though.
// Pre-render the most popular titles (real, shareable URLs); any other id is
// still reachable via in-app client-side navigation from the home page, since
// the page fetches its data client-side regardless of which id was built.
export async function generateStaticParams() {
  const query = `query { Page(perPage: 50) { media(sort: POPULARITY_DESC, type: ANIME) { id } } }`;

  const res = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  const json = await res.json();
  const ids: number[] = json?.data?.Page?.media?.map((m: { id: number }) => m.id) ?? [];

  return ids.length > 0 ? ids.map((id) => ({ id: String(id) })) : [{ id: "1" }];
}

export const dynamicParams = false;

export default function AnimeDetailPage() {
  return <AnimeDetailClient />;
}
