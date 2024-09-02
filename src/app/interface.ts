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

export interface MediaData {
  id: string;
  coverImage: CoverImageData;
  title: TitleData;
  description: string;
  siteUrl: string;
  averageScore: number;
}
