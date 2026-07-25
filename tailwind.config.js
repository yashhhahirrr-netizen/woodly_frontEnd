/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        woodly: {
          bg: '#121212',
          card: '#1E1E1E',
          border: '#2C2C2C',
          gold: '#FFC107',
          goldHover: '#E0A800',
          darkGray: '#1E1E1E',
          lightGray: '#E5E5E5',
          textMuted: '#9CA3AF',
          success: '#4CAF50',
          danger: '#F44336',
          warning: '#FF9800',
          info: '#2196F3',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        goldGlow: '0 0 20px rgba(255, 193, 7, 0.25)',
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
    },
  },
  plugins: [],
}
