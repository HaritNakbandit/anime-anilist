interface Props {}

const CardLoading = () => {
  return (
    <div
      className="w-full animate-pulse overflow-hidden rounded-xl border border-navy-border bg-navy-border dark:border-navyDark-border dark:bg-navyDark-border"
      style={{ aspectRatio: "61/75" }}
    ></div>
  );
};

export default CardLoading;
