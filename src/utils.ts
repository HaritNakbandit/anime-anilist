import moment from "moment";
import { Options } from "./app/interface";

// Mirrors next.config.cjs's basePath so plain <img> tags referencing files in
// /public resolve correctly once deployed under "/anime-anilist" in production.
export const ASSET_PREFIX = process.env.NODE_ENV === "production" ? "/anime-anilist" : "";

export const getCurrentSeason = (option: Options[]) => {
  let season = "";
  const currentMonth = moment().month() + 1; // 1-12
  switch (currentMonth) {
    case 12:
    case 1:
    case 2:
      season = "WINTER";
      break;
    case 3:
    case 4:
    case 5:
      season = "SPRING";
      break;
    case 6:
    case 7:
    case 8:
      season = "SUMMER";
      break;
    case 9:
    case 10:
    case 11:
      season = "FALL";
      break;
  }
  const currentSeason = option.find((i) => i.value === season) || option[0];
  return currentSeason;
};
