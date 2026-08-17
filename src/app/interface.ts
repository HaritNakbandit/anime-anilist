export interface Options {
  label: string;
  value: string;
}

export interface CoverImageData {
  extraLarge: string;
}

export interface TitleData {
  romaji: string;
  english: string;
}

export interface StudioData {
  nodes: Array<{ name: string | null }>;
}

export interface NextAiringEpisodeData {
  episode: number | null;
  airingAt: number | null;
  timeUntilAiring: number | null;
}

export interface MediaData {
  id: string;
  coverImage: CoverImageData;
  title: TitleData;
  description: string;
  siteUrl: string;
  averageScore: number;
  genres: (string | null)[] | null;
  format: string | null;
  episodes: number | null;
  duration: number | null;
  source: string | null;
  countryOfOrigin: string | null;
  studios: StudioData | null;
  nextAiringEpisode: NextAiringEpisodeData | null;
}

export interface PageInfo {
  hasNextPage: boolean;
}

export interface PageResponse {
  Page: {
    pageInfo: PageInfo;
    media: MediaData[];
  };
}