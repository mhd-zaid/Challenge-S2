/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'primary': '#222831',
                'primary-light': '#393E46',
                'secondary': '#00ADB5',
                'secondary-light': '#EEEEEE',
            }
        },
    },
    plugins: [],
}

