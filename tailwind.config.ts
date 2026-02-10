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
                'cyber-dark': '#0a0e17',
                'cyber-darker': '#060912',
                'cyber-card': '#111827',
                'cyber-border': '#1f2937',
                'critical': '#ef4444',
                'warning': '#f59e0b',
                'info': '#22c55e',
                'accent': '#3b82f6',
            },
            animation: {
                'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
                'fade-in': 'fade-in 0.5s ease-out',
                'slide-up': 'slide-up 0.3s ease-out',
            },
            keyframes: {
                'pulse-glow': {
                    '0%, 100%': { boxShadow: '0 0 20px 0 currentColor' },
                    '50%': { boxShadow: '0 0 40px 10px currentColor' },
                },
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'slide-up': {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
            boxShadow: {
                'glow-red': '0 0 30px rgba(239, 68, 68, 0.5)',
                'glow-yellow': '0 0 30px rgba(245, 158, 11, 0.5)',
                'glow-green': '0 0 30px rgba(34, 197, 94, 0.5)',
            },
        },
    },
    plugins: [],
};

export default config;
