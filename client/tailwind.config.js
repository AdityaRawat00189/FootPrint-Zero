/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#0D0D11',
          surface: '#141419',
          elevated: '#1D1D24',
          card: '#18181E',
          cream: '#FAF8F5',
          'cream-surface': '#F4EFEB',
          'cream-card': '#FFFFFF',
        },
        brand: {
          orange: '#FF5B22',
          'orange-hover': '#E84A12',
          'orange-light': '#FFF0EB',
          'orange-muted': 'rgba(255, 91, 34, 0.12)',
          dark: '#0D0D11',
          charcoal: '#18181E',
          gray: '#8E8E9A',
        },
        accent: {
          orange: '#FF5B22',
          amber: '#F59E0B',
          cyan: '#06B6D4',
          emerald: '#10B981',
          rose: '#EF4444',
          dark: '#141419',
        },
        glass: {
          border: 'rgba(255, 255, 255, 0.08)',
          'border-light': 'rgba(0, 0, 0, 0.08)',
          'border-hover': 'rgba(255, 91, 34, 0.4)',
        },
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'Syne', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #FF5B22 0%, #FF8A5B 100%)',
        'dark-gradient': 'linear-gradient(180deg, #141419 0%, #0D0D11 100%)',
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
