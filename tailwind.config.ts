
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1a365d",
          foreground: "#ffffff",
          50: "#f0f4f8",
          100: "#d9e2ed",
          200: "#b3c5de",
          300: "#8da8cf",
          400: "#668bcf",
          500: "#4a6fa0",
          600: "#3a5881",
          700: "#2a4162",
          800: "#1a2a43",
          900: "#0a1524",
        },
        secondary: {
          DEFAULT: "#4fd1c5",
          foreground: "#1a365d",
          50: "#edfcfa",
          100: "#d6f5f2",
          200: "#adecea",
          300: "#84e2e2",
          400: "#5ad8d8",
          500: "#33c9cf",
          600: "#29a3b0",
          700: "#217d8f",
          800: "#195769",
          900: "#102e42",
        },
        background: "#f7fafc",
        sidebar: {
          DEFAULT: "#1a365d", // Same as primary for consistency
          foreground: "#ffffff",
          border: "rgba(255,255,255,0.1)",
          accent: "rgba(255,255,255,0.1)",
          "accent-foreground": "#ffffff",
          ring: "rgba(255,255,255,0.2)",
        }
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      keyframes: {
        "fade-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
        "slide-in": {
          "0%": {
            transform: "translateX(-100%)",
          },
          "100%": {
            transform: "translateX(0)",
          },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
