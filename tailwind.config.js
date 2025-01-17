/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "special-black": "#07070A",
      },
      backgroundImage: {
        "dark-image": "url('./assets/img/background.png')",
      },
      fontFamily: {
        sans: ["SF Mono", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
