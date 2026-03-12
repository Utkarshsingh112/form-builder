/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: "#e8d5b7",
        dark: "#0a0a0a",
        card: "#111111",
        border: "#222222",
      },
      fontFamily: {
        serif: ['"DM Serif Display"', "serif"],
        mono: ['"DM Mono"', "monospace"],
      },
    },
  },
  plugins: [],
};
