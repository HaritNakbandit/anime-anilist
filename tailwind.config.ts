import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        navy: {
          light: "#f2f6fb",
          primary: "#1d355e",
          secondary: "#457b9d",
          border: "#dbe4ee",
          textPrimary: "#182a45",
          textSecondary: "#5a6c85",
        },
        navyDark: {
          bg: "#0a1424",
          primary: "#a8dafc",
          secondary: "#7fb0d4",
          border: "#23395f",
          paper: "#101e36",
          textPrimary: "#eaf0fa",
          textSecondary: "#8ea3c0",
        },
      },
    },
  },
  plugins: [],
};
export default config;
