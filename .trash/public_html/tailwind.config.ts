import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'var(--font-montserrat)',
          'ui-sans-serif',
          'system-ui'
        ]
      },
      backgroundImage: {
        'custom-pattern': "url('/assets/partner-1.jpeg')",
        'claim-bg': "url('/assets/claim-img.png')",
        'custom-pattern-2': "url('/assets/partner-2.jpeg')",
        'custom-pattern-3': "url('/assets/partner-3.jpeg')",
        'gradient-custom': "linear-gradient(to right, #00AA47, #FFC200)"
      },
      colors: {
        'custom-green': '#00AA47',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        'custom-red': '#E31600',
        'custom-yellow': '#FFC200',
        'custom-white': '#fff',
        'green-600': '#22B067',
        'green-800': '#008C4D'
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
