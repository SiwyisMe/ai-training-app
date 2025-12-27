/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#FFF1F0",
          100: "#FFE1DF",
          500: "#FF3B30",
          600: "#E6352A",
          700: "#CC2F25",
        },
        accent: {
          500: "#FF9500",
          600: "#FF8C00",
        },
        success: {
          500: "#34C759",
          600: "#30B350",
        },
      },
    },
  },
  plugins: [],
};
