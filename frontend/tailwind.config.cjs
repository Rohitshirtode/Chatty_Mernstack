module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",   // 👈 IMPORTANT
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6",   // blue-500
        secondary: "#9333ea", // purple-600
        accent: "#10b981",    // green-500
      },
    },
  },
  plugins: [],
};
