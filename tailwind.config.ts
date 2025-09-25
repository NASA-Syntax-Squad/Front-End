import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
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
        // Space theme colors
        space: {
          blue: "hsl(var(--space-blue))",
          purple: "hsl(var(--space-purple))",
          cyan: "hsl(var(--space-cyan))",
          pink: "hsl(var(--space-pink))",
          dark: "hsl(var(--space-dark))",
          darker: "hsl(var(--space-darker))",
          card: "hsl(var(--space-card))",
          glow: "hsl(var(--space-glow))",
        },
      },
      backgroundImage: {
        'gradient-cosmic': 'var(--gradient-cosmic)',
        'gradient-nebula': 'var(--gradient-nebula)',
        'gradient-glow': 'var(--gradient-glow)',
      },
      boxShadow: {
        'glow': 'var(--shadow-glow)',
        'cosmic': 'var(--shadow-cosmic)',
        'nebula': 'var(--shadow-nebula)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-glow": {
          "0%": { boxShadow: "0 0 5px hsl(var(--space-glow) / 0.5)" },
          "100%": { boxShadow: "0 0 20px hsl(var(--space-glow) / 0.8)" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "glow": {
          "0%": { filter: "brightness(1) drop-shadow(0 0 5px hsl(var(--space-glow) / 0.3))" },
          "100%": { filter: "brightness(1.1) drop-shadow(0 0 15px hsl(var(--space-glow) / 0.6))" },
        },
        "rotate": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite alternate',
        'rotate-slow': 'rotate 20s linear infinite',
        'fade-in': 'fade-in 0.6s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;