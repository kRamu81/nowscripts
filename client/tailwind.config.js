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
        now: {
          primary: '#00C08B',
          background: '#020617',
          surface: '#0F172A',
          card: '#111827',
          border: 'rgba(255,255,255,0.08)',
          accent: '#14B8A6',
          text: '#f8fafc',
          muted: '#64748b'
        }
      }
    },
  },
  plugins: [],
}
