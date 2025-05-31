// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Configure paths to all template files
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: { // Optional: Define custom theme colors
        primary: {
          DEFAULT: '#6366F1', // Indigo-500
          light: '#818CF8',   // Indigo-400
          dark: '#4F46E5',    // Indigo-600
        },
        secondary: {
          DEFAULT: '#EC4899', // Pink-500
          light: '#F472B6',   // Pink-400
          dark: '#DB2777',    // Pink-600
        },
        // For dark theme
        dark: {
          bg: '#111827',      // Gray-900
          card: '#1F2937',    // Gray-800
          text: '#F3F4F6',    // Gray-100
          'text-secondary': '#9CA3AF', // Gray-400
        },
        // For light theme
        light: {
          bg: '#F9FAFB',      // Gray-50
          card: '#FFFFFF',    // White
          text: '#1F2937',    // Gray-800
          'text-secondary': '#6B7280', // Gray-500
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // A nice modern font
      },
      boxShadow: {
        'custom-light': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'custom-dark': '0 4px 6px -1px rgba(255, 255, 255, 0.05), 0 2px 4px -1px rgba(255, 255, 255, 0.03)',
      }
    },
  },
  plugins: [],
}