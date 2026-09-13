/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14121A",
        "ink-soft": "#2B2733",
        paper: "#EDEAE3",
        "paper-dim": "#DFDACD",
        zing: "#FF3D6E",
        volt: "#C6FF3D",
        muted: "#8B8698",
      },
      fontFamily: {
        display: ["'Anton'", "sans-serif"],
        body: ["'Work Sans'", "sans-serif"],
      },
      backgroundImage: {
        halftone:
          "radial-gradient(circle, #14121A 1px, transparent 1.4px)",
      },
      backgroundSize: {
        halftone: "10px 10px",
      },
    },
  },
  plugins: [],
};
