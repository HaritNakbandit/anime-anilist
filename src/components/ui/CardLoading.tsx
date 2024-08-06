import { Skeleton } from "@mui/material";

interface Props {}

const CardLoading = (props: Props) => {
  return (
    <div className="flex flex-col" >
      <Skeleton
        variant="rectangular"
        sx={{
          height: "300px",
          aspectRatio: 61 / 75,
          borderRadius: "5px",
          objectFit: "fill",
        }}
      />
      <Skeleton className="py-2" />
    </div>
  );
};
export default CardLoading;
