import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: "#111111",
        cream: "#f5f0e8",
        terracotta: "#c4613a",
        amber: "#d4a254",
        card: "#1a1a1a",
        border: "#2a2a2a",
        "border-hover": "#3a3a3a",
      },
      fontFamily: {
        serif: ["EB Garamond", "Georgia", "serif"],
        sans: ["DM Sans", "system-ui", "sans-serif"],
      },
      maxWidth: {
        prose: "680px",
      },
    },
  },
  plugins: [],
};
export default config;
