import moment from "moment";
import { Options } from "./app/interface";

export const getCurrentSeason = (option: Options[]) => {
  let season = "";
  const currentMouth = 1 + moment().month();
  switch (currentMouth) {
    case 12 || 1 || 2:
      season = "WINTER";
      break;
    case 3 || 4 || 5:
      season = "SPRING";
      break;
    case 6 || 7 || 8:
      season = "SUMMER";
      break;
    case 9 || 10 || 11:
      season = "FALL";
      break;
  }
  const currentSeason = option.find((i) => i.value === season) || option[0];
  return currentSeason;
};
