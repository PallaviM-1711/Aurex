/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#090A0F',
        secondary: '#0F1117',
        card: '#131620',
        'card-hover': '#171B26',
        'card-border': 'rgba(255, 255, 255, 0.08)',
        muted: '#94A3B8',
        accent: {
          indigo: '#6366F1',
          blue: '#3B82F6',
          cyan: '#0EA5E9',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#F43F5E',
        },
        aurex: {
          DEFAULT: '#6366F1',
          subtle: 'rgba(99, 102, 241, 0.12)',
          border: 'rgba(99, 102, 241, 0.25)',
          mint: '#10B981',
          mintSubtle: 'rgba(16, 185, 129, 0.12)',
        },
      },
      backgroundImage: {
        'subtle-card': 'linear-gradient(180deg, rgba(19, 22, 32, 0.9) 0%, rgba(15, 17, 23, 0.95) 100%)',
        'hero-gradient': 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(14, 165, 233, 0.04) 50%, rgba(9, 10, 15, 0) 100%)',
      },
      boxShadow: {
        'soft-glow': '0 0 25px -5px rgba(99, 102, 241, 0.12)',
        'soft-mint': '0 0 20px -5px rgba(16, 185, 129, 0.12)',
        'card-depth': '0 8px 30px -8px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
};
