/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'playfair': ['var(--font-playfair)', 'serif'],
        'inter': ['var(--font-inter)', 'sans-serif'],
        'poppins': ['var(--font-poppins)', 'sans-serif'],
        'montserrat': ['var(--font-montserrat)', 'sans-serif'],
        'roboto': ['var(--font-roboto)', 'sans-serif'],
        'opensans': ['var(--font-opensans)', 'sans-serif'],
        'lato': ['var(--font-lato)', 'sans-serif'],
        'raleway': ['var(--font-raleway)', 'sans-serif'],
        'dancing': ['var(--font-dancing)', 'cursive'],
        'pacifico': ['var(--font-pacifico)', 'cursive'],
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out',
        'slide-up': 'slide-up 0.6s ease-out',
        'slide-down': 'slide-down 0.6s ease-out',
        'slide-left': 'slide-left 0.6s ease-out',
        'slide-right': 'slide-right 0.6s ease-out',
        'zoom-in': 'zoom-in 0.6s ease-out',
        'zoom-out': 'zoom-out 0.6s ease-out',
        'flip': 'flip 0.6s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'pop-in': 'popIn 0.6s ease-out',
        'pop-effect': 'popEffect 0.4s ease-out',
      },
    },
  },
  plugins: [],
}; 