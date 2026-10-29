module.exports = {
            content: ["./index.html", "./App.tsx", "./components/**/*.tsx", "./utils/**/*.ts"],
            theme: {
                extend: {
                    opacity: Object.fromEntries(Array.from({length:101}, (_,i) => [i, String(i/100)])),
                    colors: {
                        champagne: {
                            50: '#FBFAF7',
                            100: '#F1E8DA',
                            200: '#D9C08C',
                            300: '#B08A4D',
                        },
                        sage: {
                            50: '#F0F3E9',
                            100: '#E1E8D8',
                            200: '#C2CEB5',
                            300: '#859A72',
                            400: '#627458',
                            500: '#42634D',
                            600: '#244b38',
                            700: '#233c2e',
                            800: '#1b3226',
                            900: '#213A31',
                            950: '#11281e',
                        },
                        dustyGold: '#B08A4D',
                        brass: '#C8A86B',
                        ink: '#213A31',
                        wine: '#294E3C',
                        petrol: '#42634D',
                    },
                    fontFamily: {
                        serif: ['A2Z', '에이투지체', 'Outfit', 'sans-serif'],
                        sans: ['A2Z', '에이투지체', 'Outfit', 'sans-serif'],
                        script: ['A2Z', '에이투지체', 'Outfit', 'sans-serif'],
                    }
                }
            }
        };
