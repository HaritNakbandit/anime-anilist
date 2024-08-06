"use client";

import HeaderBar from "./HeaderBar";
import Footer from "./Footer";
import { Box } from "@mui/material";

const PageLayout = (props: { children: React.ReactNode }) => {
  const { children } = props;
  const headerBarHeight = 64;
  return (
    <div>
      <HeaderBar />
      <Box sx={{ mt: `${headerBarHeight}px` }}>{children}</Box>
      <Footer />
    </div>
  );
};

export default PageLayout;
