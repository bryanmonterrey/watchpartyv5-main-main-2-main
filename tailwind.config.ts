const { nextui } = require("@nextui-org/react");
const { withUt } = require("uploadthing/tw");

/** @type {import('tailwindcss').Config} */
module.exports = withUt({
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(10px)',
      },
      backgroundImage: {
        'custom-gradient': 'linear-gradient(to right, #2CA2B4, #5598DE, #7F87FF)',
      },
      colors: {
        'diagonal-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.10), rgba(153, 153, 153, 0.10))',
        appleblack: "#09090A",
        dropdownblack: "#0B0B0D",
        studioblack: "#232225",
        yandhi: "#E8BEFF",
        gray: "#808080",
        blueberry: "#B4B5DF",
        white: "#E7E9EA",
        litewhite: "#E7E9EA",
        litepurp: "#9B9B9B",
        offline: "#595656",
        popblack: "#0F0F12",
        graydarkk: "#585A70",
        darkwhite: "#232225",
        purpgray: "#B4B5DF",
        buttongray: "#232328",
        hovergray: "#27272B",
        bleed: "#FF2D49",
        uniblack: "#0D0D0D",
        lightpurp: "#1D9BF0",
        greeny: "#A399C5",
        purp: "#8C8EE0",
        bgblack: "#0A0A0D",
        azul: "rgb(29, 155, 240)",
        applegray: "#D2D2D2",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        somegray: "#DCDCDC",
        somelight: "#111111",
        betterblac: "080808",
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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        '15': '15px',
      },
      fontFamily: {
        "Sohne": "Sohne",
        "gotham": "Gotham",
        "sf-pro-display": "'SFProDisplay'",
        bookishtrial: "BookishTrial",
        "gentium-book-basic": "'Gentium Book Basic'",
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
        slideDownAndFade: {
          from: { opacity: '0', transform: 'translateY(-2px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeftAndFade: {
          from: { opacity: '0', transform: 'translateX(2px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        slideUpAndFade: {
          from: { opacity: '0', transform: 'translateY(2px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideRightAndFade: {
          from: { opacity: '0', transform: 'translateX(-2px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        slideDownAndFade: 'slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideLeftAndFade: 'slideLeftAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideUpAndFade: 'slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideRightAndFade: 'slideRightAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  variants: {
    backdropFilter: ['responsive'],
  },
  plugins: [
    require('tailwindcss-filters'),
    require("tailwindcss-animate"),
    nextui({
      themes: {
        light: {
          colors: {
            primary: {
              foreground: "#000000",
              DEFAULT: "#00ED89",
            },
          },
        },
        dark: {
          colors: {
            primary: {
              foreground: "#000000",
              DEFAULT: "#00ED89",
            },
          },
        },
        mytheme: {
          extend: "dark",
          colors: {
            primary: {
              DEFAULT: "#00ED89",
              foreground: "#000000",
            },
            focus: "#BEF264",
          },
        },
      },
    }),
  ],
});