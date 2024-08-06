import React from "react";
import { styled } from "@mui/system";
import { IconButton } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";

const FooterWrapper = styled("div")(({ theme }) => {
  return {
    height: "60px",
    backgroundColor: theme.palette.background.paper,
    padding: "10px",
  };
});


const FooterContact = styled("div")({
  display: "flex",
  justifyContent: "center",
  gap: "1rem",
});

const Footer = () => {
  return (
    <FooterWrapper id="contact">
      <FooterContact>
        <IconButton
          onClick={() => window.open("https://github.com/HaritNakbandit")}
        >
          <GitHubIcon />
        </IconButton>
      </FooterContact>
    </FooterWrapper>
  );
};

export default Footer;
