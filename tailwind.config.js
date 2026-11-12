const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./*.{html,js}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      animation: {
        aurora: "aurora 60s linear infinite",
        "pencil-body1": "pencilBody1 3s linear infinite",
        "pencil-body2": "pencilBody2 3s linear infinite",
        "pencil-body3": "pencilBody3 3s linear infinite",
        "pencil-eraser": "pencilEraser 3s linear infinite",
        "pencil-eraser-skew": "pencilEraserSkew 3s ease-in-out infinite",
        "pencil-point": "pencilPoint 3s linear infinite",
        "pencil-rotate": "pencilRotate 3s linear infinite",
        "pencil-stroke": "pencilStroke 3s linear infinite",
      },
      keyframes: {
        aurora: {
          from: {
            backgroundPosition: "50% 50%, 50% 50%",
          },
          to: {
            backgroundPosition: "350% 50%, 350% 50%",
          },
        },
        pencilBody1: {
          "0%, 100%": {
            strokeDashoffset: "351.86",
            transform: "rotate(-90deg)",
          },
          "50%": {
            strokeDashoffset: "150.8",
            transform: "rotate(-225deg)",
          },
        },
        pencilBody2: {
          "0%, 100%": {
            strokeDashoffset: "406.84",
            transform: "rotate(-90deg)",
          },
          "50%": {
            strokeDashoffset: "174.36",
            transform: "rotate(-225deg)",
          },
        },
        pencilBody3: {
          "0%, 100%": {
            strokeDashoffset: "296.88",
            transform: "rotate(-90deg)",
          },
          "50%": {
            strokeDashoffset: "127.23",
            transform: "rotate(-225deg)",
          },
        },
        pencilEraser: {
          "0%, 100%": {
            transform: "rotate(-45deg) translate(49px, 0)",
          },
          "50%": {
            transform: "rotate(0deg) translate(49px, 0)",
          },
        },
        pencilEraserSkew: {
          "0%, 32.5%, 67.5%, 100%": {
            transform: "skewX(0)",
          },
          "35%, 65%": {
            transform: "skewX(-4deg)",
          },
          "37.5%, 62.5%": {
            transform: "skewX(8deg)",
          },
          "40%, 45%, 50%, 55%, 60%": {
            transform: "skewX(-15deg)",
          },
          "42.5%, 47.5%, 52.5%, 57.5%": {
            transform: "skewX(15deg)",
          },
        },
        pencilPoint: {
          "0%, 100%": {
            transform: "rotate(-90deg) translate(49px, -30px)",
          },
          "50%": {
            transform: "rotate(-225deg) translate(49px, -30px)",
          },
        },
        pencilRotate: {
          from: {
            transform: "translate(100px, 100px) rotate(0deg)",
          },
          to: {
            transform: "translate(100px, 100px) rotate(720deg)",
          },
        },
        pencilStroke: {
          from: {
            strokeDashoffset: "439.82",
            transform: "translate(100px, 100px) rotate(-113deg)",
          },
          "50%": {
            strokeDashoffset: "164.93",
            transform: "translate(100px, 100px) rotate(-113deg)",
          },
          "75%, 100%": {
            strokeDashoffset: "439.82",
            transform: "translate(100px, 100px) rotate(112deg)",
          },
        },
      },
    },
  },
  plugins: [addVariablesForColors],
};

function addVariablesForColors({ addBase, theme }) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}
