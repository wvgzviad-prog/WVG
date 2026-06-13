import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0f2557',
          dark: '#091840',
          light: '#1a3a7c',
        },
        gold: {
          DEFAULT: '#c9a84c',
          light: '#e8c96a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Georgian', 'sans-serif'],
        geo: ['Noto Sans Georgian', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
