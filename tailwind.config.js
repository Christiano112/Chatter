/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#543EE0',
          50: '#EDE9FF',
        },
        secondary: {
          DEFAULT: '#FFEDCC',
          50: '#FFFFFF',
        },
        tertiary: {
          DEFAULT: '#111111',
          50: '#626262',
        },
      },
    },
    plugins: [],
  }
}
