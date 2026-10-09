/** Token del brand Feltrin: unica fonte di verità per colori, font e animazioni. */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1E222A',
        paper: '#F2F4F7',
        accent: '#0052FF',
        accentSoft: '#7BA3FF', // tinta chiara dell'accento: solo testo/link su fondi scuri (contrasto AA)
      },
      fontFamily: {
        sans: ['"Josefin Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      transitionTimingFunction: {
        steel: 'cubic-bezier(0.22, 0.8, 0.24, 1)',
      },
      keyframes: {
        pulseLine: { '0%,100%': { opacity: '0.35' }, '50%': { opacity: '0.9' } },
        drift: { '0%': { transform: 'translate3d(0,0,0)' }, '100%': { transform: 'translate3d(-4%,-3%,0)' } },
        rise: { from: { opacity: '0', transform: 'translateY(14px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
      animation: {
        pulseLine: 'pulseLine 4.5s ease-in-out infinite',
        drift: 'drift 70s linear infinite alternate',
        rise: 'rise 0.9s cubic-bezier(0.22,0.8,0.24,1) both',
      },
    },
  },
  plugins: [],
};
