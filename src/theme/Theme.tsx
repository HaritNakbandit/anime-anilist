"use client";

import React, { useState, useMemo, createContext, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

const Theme = (props: { children: React.ReactNode }) => {
  const { children } = props;

  const [mode, setMode] = useState<string>("light");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        localStorage.settItem(
          "theme",
          localStorage.getItem("theme") === "light" ? "dark" : "light"
        );
        setMode(localStorage.getItem("theme") ?? "light");
      },
    }),
    []
  );

  useEffect(() => {
    const theme = localStorage.getItem("theme") ?? "light";
    setMode(theme);
    localStorage.setItem("theme", theme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          ...(mode === "light"
            ? {
                // palette values for light mode
                primary: {
                  main: "#142850",
                },
                divider: "#142850",
                background: {
                  default: "#EDF7FA",
                  paper: "#ffffff",
                },
                text: {
                  primary: "#142850",
                  secondary: "#ffffff",
                },
              }
            : {
                // palette values for dark mode
                primary: {
                  main: "#ffffff",
                },
                divider: "#ffffff",
                background: {
                  default: "#202124",
                  paper: "#171717",
                },
                text: {
                  primary: "#ffffff",
                  secondary: "#000000",
                },
              }),
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default Theme;
