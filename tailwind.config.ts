import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontSize: {
      xs: "10px",
      sm: "13px",
      base: "16px",
      lg: "20px",
      xl: "26px",
      "2xl": "32px",
      "3xl": "42px",
      "4xl": "68px",
      "5xl": "110px",
    },
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
      spacing: {
        "phi-1": "4px",
        "phi-2": "6px",
        "phi-3": "10px",
        "phi-4": "16px",
        "phi-5": "26px",
        "phi-6": "42px",
        "phi-7": "68px",
        "phi-8": "110px",
      },
      maxWidth: {
        prose: "680px",
      },
      lineHeight: {
        golden: "1.618",
      },
      transitionTimingFunction: {
        phi: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      },
      transitionDuration: {
        fast: "200ms",
        base: "400ms",
        slow: "600ms",
        fly: "1000ms",
        drift: "1600ms",
        breath: "2600ms",
      },
      borderRadius: {
        phi: "10px",
      },
    },
  },
  plugins: [],
};
export default config;
