export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: { sea: { DEFAULT: '#0E7C86', dark: '#0A5560', light: '#E6F3F5' }, ink: '#0B2B3B' },
      fontFamily: { display: ['"Bricolage Grotesque"', 'Georgia', 'serif'], sans: ['"Instrument Sans"', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
};
