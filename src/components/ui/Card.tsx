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
    <div className="flex flex-col">
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
        <div className="left-2 bottom-2 z-10 absolute bg-zinc-300 px-[4px] py-[2px] rounded opacity-80">
          <div className="flex flex-row items-center">
            <StarIcon sx={{ fontSize: 15 }} />
            <Typography
              gutterBottom
              variant="body2"
              color="primary"
              className="font-semibold m-0"
            >
              {props.score}
            </Typography>
          </div>
        </div>
      </div>
      <Typography
        gutterBottom
        variant="body2"
        color="primary"
        className="py-2 font-semibold"
      >
        {props.title}
      </Typography>
    </div>
  );
};
export default Card;
