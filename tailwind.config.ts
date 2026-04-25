import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "var(--ww-ink)",
        charcoal: "var(--ww-charcoal)",
        graphite: "var(--ww-graphite)",
        slate: "var(--ww-slate)",
        ash: "var(--ww-ash)",
        mist: "var(--ww-mist)",
        fog: "var(--ww-fog)",
        cloud: "var(--ww-cloud)",
        paper: "var(--ww-paper)",
        accent: "var(--ww-accent)",
        "accent-soft": "var(--ww-accent-soft)",
        "accent-deep": "var(--ww-accent-deep)",
        "accent-sky": "var(--ww-accent-sky)",
        brand: "var(--ww-brand)",
        "brand-sky": "var(--ww-brand-sky)",
        "brand-bg": "var(--ww-brand-bg)",
        "brand-deep": "var(--ww-brand-deep)",
        danger: "var(--ww-danger)",
        success: "var(--ww-success)",
        warning: "var(--ww-warning)",
      },
      borderRadius: {
        "ww-xs": "var(--ww-r-xs)",
        "ww-sm": "var(--ww-r-sm)",
        "ww-md": "var(--ww-r-md)",
        "ww-lg": "var(--ww-r-lg)",
        "ww-xl": "var(--ww-r-xl)",
      },
      boxShadow: {
        "ww-card": "var(--ww-shadow-card)",
        "ww-pop": "var(--ww-shadow-pop)",
        "ww-btn": "var(--ww-shadow-btn)",
        "ww-blue": "var(--ww-shadow-blue)",
        "ww-ink": "var(--ww-shadow-ink)",
      },
      fontFamily: {
        sans: ["Pretendard Variable", "Pretendard", "system-ui", "sans-serif"],
        disp: ["Pretendard Variable", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      maxWidth: {
        app: "428px",
        site: "1240px",
      },
    },
  },
  plugins: [],
};
export default config;
