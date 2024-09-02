import { Box, Typography } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

interface Props {
  onClick: Function;
  title: string;
  imgSrc: string;
  score: number;
}

const Card = (props: Props) => {
  return (
    <div className="flex flex-col items-center sm:items-start">
      <div className="relative cursor-pointer hover:scale-105 duration-300">
        <Box
          component="img"
          sx={{
            height: "300px",
            aspectRatio: 61 / 75,
            borderRadius: "5px",
            objectFit: "fill",
          }}
          alt={props.title}
          src={props.imgSrc}
          className="drop-shadow-xl "
          onClick={() => props.onClick()}
        />
        {props.score > 0 && (
          <div className="left-2 bottom-2 z-10 absolute bg-white/[.6] px-[4px] py-[2px] rounded-xl">
            <div className="flex flex-row items-center">
              <StarIcon sx={{ fontSize: 15 }} />
              <Typography
                gutterBottom
                variant="body2"
                color="primary"
                sx={{ margin: 0 }}
                className="font-semibold"
              >
                {props.score.toFixed(1)}
              </Typography>
            </div>
          </div>
        )}
      </div>
      <Typography
        gutterBottom
        variant="body2"
        color="primary"
        className="py-2 font-semibold text-center	sm:text-start"
      >
        {props.title}
      </Typography>
    </div>
  );
};
export default Card;
