import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#FF6F0F",
          50: "#FFF2E8",
          100: "#FFE0CC",
          500: "#FF6F0F",
          600: "#E65A00",
          700: "#B34500",
        },
      },
    },
  },
  plugins: [],
};

export default config;
