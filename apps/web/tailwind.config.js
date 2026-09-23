/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        twin: {
          bg: "#080c14",
          panel: "#0e1526",
          panelBorder: "rgba(30, 58, 110, 0.4)",
          accent: "#00d2ff",
          accentGlow: "rgba(0, 210, 255, 0.2)",
          green: "#00f076",
          amber: "#ffb703",
          red: "#ff2a5f",
          purple: "#9d4edd"
        }
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "Oxygen", "Ubuntu", "sans-serif"],
        mono: ["'JetBrains Mono'", "Consolas", "'Courier New'", "monospace"]
      }
    },
  },
  plugins: [],
}
