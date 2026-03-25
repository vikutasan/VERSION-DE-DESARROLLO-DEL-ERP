/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./main.jsx",
        "./apps/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            animation: {
                'fade': 'fade 0.5s ease-in-out',
            },
            keyframes: {
                fade: {
                    '0%': { opacity: 0 },
                    '100%': { opacity: 1 },
                },
            },
        },
    },
    plugins: [],
}
