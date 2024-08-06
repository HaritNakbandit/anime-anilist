import { gql } from "@apollo/client";

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
        lastPage
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
          native
          userPreferred
        }
        description
        siteUrl
        averageScore
      }
    }
  }
`;
