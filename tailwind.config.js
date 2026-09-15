/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        
        // Video-Harmonized Warm Romance Palette
        gold: {
          DEFAULT: "#E5A93C",
          light: "#F7D878",
          dark: "#9B6B15",
          shimmer: "#FFF3D1",
          muted: "rgba(229, 169, 60, 0.16)",
        },
        espresso: {
          DEFAULT: "#1C1412",
          dark: "#140D0C",
          card: "#281D1A",
          border: "#42302B",
          light: "#3B2B27",
        },
        cream: {
          DEFAULT: "#FAF6F0",
          soft: "#F3ECE2",
          muted: "#EADFCF",
          card: "#FFFFFF",
        },
        rose: {
          DEFAULT: "#C86D7B",
          light: "#F7E4E7",
          dark: "#964552",
          blush: "#FBF2F4",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        cormorant: ['"Cormorant Garamond"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
        '2xl': "1rem",
        '3xl': "1.5rem",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        md: "0 4px 16px rgba(28, 20, 18, 0.06)",
        lg: "0 10px 30px rgba(28, 20, 18, 0.1)",
        xl: "0 20px 50px rgba(28, 20, 18, 0.14)",
        gold: "0 6px 28px rgba(229, 169, 60, 0.3)",
        "gold-lg": "0 12px 40px rgba(229, 169, 60, 0.45)",
        "gold-glow": "0 0 35px rgba(229, 169, 60, 0.38)",
        luxury: "0 15px 45px rgba(20, 13, 12, 0.3)",
        card: "0 4px 20px rgba(28, 20, 18, 0.05)",
        rose: "0 6px 24px rgba(200, 109, 123, 0.25)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "gold-shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "float-particle": {
          "0%": { transform: "translateY(0) scale(0.8)", opacity: "0" },
          "20%": { opacity: "0.6" },
          "80%": { opacity: "0.4" },
          "100%": { transform: "translateY(-120px) scale(1.1)", opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in": "fade-in 0.8s ease-out forwards",
        "gold-shimmer": "gold-shimmer 3.5s ease-in-out infinite",
        "float-particle": "float-particle 6s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
