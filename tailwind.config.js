/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./lib/**/*.{js,ts,jsx,tsx}",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#ec9c13",
                "background-light": "#f8f7f6",
                "background-dark": "#181511",
                "surface-dark": "#221b10",
                "border-dark": "#393328",
                "dashed-border-dark": "#544b3b",
                "text-light": "#1c1917",
                "text-dark": "#ffffff",
                "text-muted-light": "#78716c",
                "text-muted-dark": "#b9af9d",
            },
            fontFamily: {
                "display": ["Plus Jakarta Sans", "Noto Sans", "sans-serif"],
                "caveat": ['Caveat', 'cursive'],
                "permanent-marker": ['Permanent Marker', 'cursive'],
            },
            borderRadius: {
                "DEFAULT": "0.25rem",
                "lg": "0.5rem",
                "xl": "0.75rem",
                "full": "9999px"
            },
        },
    },
    plugins: [],
}
