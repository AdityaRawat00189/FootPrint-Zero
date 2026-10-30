/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#141622',
          surface: '#1C1E2D',
          elevated: '#24273A',
          card: '#1F2233',
          cream: '#FAF8F5',
          'cream-surface': '#F4EFEB',
          'cream-card': '#FFFFFF',
        },
        brand: {
          orange: '#FF5B22',
          'orange-hover': '#E84A12',
          'orange-light': '#FFF0EB',
          'orange-muted': 'rgba(255, 91, 34, 0.12)',
          dark: '#141622',
          charcoal: '#1C1E2D',
          gray: '#9496A1',
        },
        accent: {
          orange: '#FF5B22',
          amber: '#F59E0B',
          cyan: '#06B6D4',
          emerald: '#10B981',
          rose: '#EF4444',
          dark: '#1C1E2D',
        },
        glass: {
          border: 'rgba(255, 255, 255, 0.12)',
          'border-light': 'rgba(0, 0, 0, 0.08)',
          'border-hover': 'rgba(255, 91, 34, 0.45)',
        },
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'Syne', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #FF5B22 0%, #FF8A5B 100%)',
        'dark-gradient': 'linear-gradient(180deg, #1C1E2D 0%, #141622 100%)',
        'orange-card-gradient': 'linear-gradient(135deg, #FF5B22 0%, #E8450E 100%)',
      },
      boxShadow: {
        'glow-orange': '0 10px 30px -5px rgba(255, 91, 34, 0.35)',
        'glow-orange-sm': '0 4px 20px -2px rgba(255, 91, 34, 0.25)',
        'card-soft': '0 10px 40px -10px rgba(0, 0, 0, 0.06)',
        'card-dark': '0 12px 40px -10px rgba(0, 0, 0, 0.5)',
      },
      borderRadius: {
        '3xl': '24px',
        '4xl': '32px',
      },
    },
  },
  plugins: [],
};
