import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./common/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#59d670",

          secondary: "#a33420",

          accent: "#17b25d",

          neutral: "#272b30",

          "base-100": "#f5f5fa",

          info: "#899ae6",

          success: "#57dbaf",

          warning: "#eda950",

          error: "#f5533d",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
export default config;
