module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#F55700", // Naranja intenso
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#F0F1F3",
          foreground: "#020817",
        },
        accent: {
          DEFAULT: "#6D7074",
          foreground: "#020817",
        },
        background: "#FAFAFB",
        foreground: "#020817",
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#020817",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#020817",
        },
        muted: {
          DEFAULT: "#F0F1F3",
          foreground: "#6D7074",
        },
        destructive: {
          DEFAULT: "#FF4C4C",
          foreground: "#FFFFFF",
        },
        border: "#E0E0E0",
        input: "#E0E0E0",
        ring: "#F55700", // igual que primary
        chart: {
          1: "#F55700", // Naranja intenso
          2: "#2A2967", // Azul profundo
          3: "#9622F0", // Púrpura vibrante
          4: "#FFC107", // Amarillo (puede mantenerse)
          5: "#8E44AD", // Lila oscuro (puede mantenerse o cambiar por otro tono complementario)
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      fontSize: {
        heading: "28px",
        body: "16px",
      },
      fontWeight: {
        heading: "600",
        body: "400",
      },
      borderRadius: {
        sm: "0.125rem",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
