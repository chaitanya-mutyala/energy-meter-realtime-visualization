/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        tv: "1200px", // 👈 your TV breakpoint
      },
    },
  },
  plugins: [],
};
