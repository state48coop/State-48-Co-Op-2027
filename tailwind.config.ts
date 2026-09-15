import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#171716",
        walnut: "#5b3b29",
        sand: "#e7ddcc",
        ember: "#bf5b2c",
        bone: "#f5f1e9"
      },
      fontFamily: { sans: ["Arial", "sans-serif"] }
    }
  },
  plugins: []
};

export default config;
