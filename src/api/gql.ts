import { gql, TypedDocumentNode } from "@apollo/client/core";

export type PageResponse = {
  Page: {
    pageInfo: {
      hasNextPage: boolean;
    };
    media: Array<{
      id: string;
      coverImage: { extraLarge: string };
      title: { romaji: string; english: string };
      description: string;
      siteUrl: string;
      averageScore: number;
      genres: (string | null)[] | null;
      format: string | null;
      episodes: number | null;
      duration: number | null;
      source: string | null;
      countryOfOrigin: string | null;
      studios: { nodes: Array<{ name: string | null }> } | null;
      nextAiringEpisode: { episode: number | null; airingAt: number | null; timeUntilAiring: number | null } | null;
    }>;
  };
};

export const GET_MEDIA = gql`
  query getMedia(
    $page: Int
    $limit: Int
    $year: Int
    $season: MediaSeason
    $search: String
    $format: MediaFormat
    $sort: [MediaSort]
  ) {
    Page(page: $page, perPage: $limit) {
      pageInfo {
        hasNextPage
      }
      media(
        search: $search
        seasonYear: $year
        season: $season
        format: $format
        sort: $sort
      ) {
        id
        coverImage {
          extraLarge
        }
        title {
          romaji
          english
        }
        description
        siteUrl
        averageScore
        genres
        format
        episodes
        duration
        source
        countryOfOrigin
        studios(isMain: true) {
          nodes {
            name
          }
        }
        nextAiringEpisode {
          episode
          airingAt
          timeUntilAiring
        }
      }
    }
  }
` as TypedDocumentNode<PageResponse>;

export type MediaDetailResponse = {
  Media: {
    id: string;
    title: { romaji: string | null; english: string | null; native: string | null };
    description: string | null;
    coverImage: { extraLarge: string | null; large: string | null } | null;
    bannerImage: string | null;
    format: string | null;
    episodes: number | null;
    averageScore: number | null;
    popularity: number | null;
    favourites: number | null;
    status: string | null;
    genres: (string | null)[] | null;
    season: string | null;
    seasonYear: number | null;
    startDate: { year: number | null; month: number | null; day: number | null } | null;
    endDate: { year: number | null; month: number | null; day: number | null } | null;
    source: string | null;
    duration: number | null;
    siteUrl: string | null;
    nextAiringEpisode: { episode: number | null } | null;
    relations: { edges: Array<{ node: { id: string | null; title: { romaji: string | null; english: string | null }; type: "ANIME" | "MANGA" | "VIDEO_GAME" | "NOVEL" }; relationType: string }> } | null;
    characters: { edges: Array<{ role: string | null; node: { name: { full: string | null }; image: { large: string | null } | null } | null }> } | null;
    staff: { edges: Array<{ role: string | null; node: { name: { full: string | null } } | null }> } | null;
    streamingEpisodes: Array<{ title: string | null; thumbnail: string | null; url: string | null }> | null;
  };
};

export const GET_MEDIA_DETAIL = gql`
  query getMediaDetail($id: Int) {
    Media(id: $id, type: ANIME) {
      id
      title {
        romaji
        english
        native
      }
      description
      coverImage {
        extraLarge
        large
      }
      bannerImage
      format
      episodes
      averageScore
      popularity
      favourites
      status
      genres
      season
      seasonYear
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
      source
      duration
      siteUrl
      nextAiringEpisode {
        episode
      }
      relations {
        edges {
          node {
            id
            title {
              romaji
              english
            }
            type
          }
          relationType
        }
      }
      characters(perPage: 12) {
        edges {
          role
          node {
            name {
              full
            }
            image {
              large
            }
          }
        }
      }
      staff(perPage: 8) {
        edges {
          role
          node {
            name {
              full
            }
          }
        }
      }
      streamingEpisodes {
        title
        thumbnail
        url
      }
    }
  }
` as TypedDocumentNode<MediaDetailResponse>;