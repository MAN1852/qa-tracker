/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#4F46E5', // Indigo-600
                primaryHover: '#4338CA', // Indigo-700
                accent: '#8B5CF6', // Violet-500
                background: '#F8FAFC', // Slate-50
                surface: '#FFFFFF',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
                'card': '0 0 0 1px rgba(0, 0, 0, 0.03), 0 1px 2px rgba(0, 0, 0, 0.05)',
            }
        },
    },
    plugins: [],
}
