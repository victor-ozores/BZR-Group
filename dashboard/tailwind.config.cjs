/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          950: "#040a22",
          900: "#081137",
          800: "#0d1a47",
          700: "#15245c",
        },
        line: "#22305f",
        marca: "#375eff",
        marcaForte: "#074DC8",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
    },
  },
  plugins: [],
};
