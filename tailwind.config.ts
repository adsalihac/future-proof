import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#050505",
        coal: "#18181b",
        muted: "#71717a",
        line: "#e4e4e7",
        paper: "#fafafa"
      },
      fontFamily: {
        body: ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
        heading: ["Space Grotesk", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 18px 48px rgba(5, 5, 5, 0.08)",
        card: "0 10px 26px rgba(5, 5, 5, 0.06)"
      }
    }
  },
  plugins: []
};

export default config;
