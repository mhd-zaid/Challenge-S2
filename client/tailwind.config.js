/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'primary': {
                    50: '#FFF2F5',
                    100: '#FFCCD5',
                    200: '#FFB3C1',
                    300: '#FF8FA3',
                    400: '#FF758F',
                    500: '#FF4D6D',
                    600: '#C9184A',
                    700: '#A4133C',
                    800: '#800F2F',
                    900: '#590D22',
                },
                'secondary': {
                    100: '#F6F6F6',
                    200: '#DDDCE4',
                    300: '#8785A2',
                    400: '#5B5973',
                }
            },
            fontFamily: {
                'body': ['Nunito'],
            },
        },
    },
    plugins: [
        // eslint-disable-next-line no-undef
        require('@tailwindcss/forms'),
        // eslint-disable-next-line no-undef
        require('@tailwindcss/aspect-ratio'),
    ],
}

