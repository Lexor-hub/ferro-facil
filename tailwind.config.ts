import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					dark: 'hsl(var(--primary-dark))',
					light: 'hsl(var(--primary-light))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))'
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					foreground: 'hsl(var(--warning-foreground))'
				},
				info: {
					DEFAULT: 'hsl(var(--info))',
					foreground: 'hsl(var(--info-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					dark: 'hsl(var(--accent-dark))',
					light: 'hsl(var(--accent-light))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				badge: {
					DEFAULT: 'hsl(var(--badge))',
					foreground: 'hsl(var(--badge-foreground))'
				},
				'badge-success': {
					DEFAULT: 'hsl(var(--badge-success))',
					foreground: 'hsl(var(--badge-success-foreground))'
				},
				'badge-warning': {
					DEFAULT: 'hsl(var(--badge-warning))',
					foreground: 'hsl(var(--badge-warning-foreground))'
				},
				'badge-destructive': {
					DEFAULT: 'hsl(var(--badge-destructive))',
					foreground: 'hsl(var(--badge-destructive-foreground))'
				}
			},
			fontFamily: {
				inter: ['Inter', 'system-ui', 'sans-serif'],
			},
			maxWidth: {
				'container': 'var(--container-max)',
			},
			spacing: {
				'header': 'var(--header-height)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			boxShadow: {
				card: 'var(--shadow-card)',
				'card-hover': 'var(--shadow-card-hover)',
				premium: 'var(--shadow-premium)',
				inner: 'var(--shadow-inner)',
				glow: 'var(--shadow-glow)',
				float: 'var(--shadow-float)',
			},
			backgroundImage: {
        'gradient-premium': 'var(--gradient-premium)',
        'gradient-gold': 'var(--gradient-gold)',
        'gradient-accent': 'var(--gradient-accent)',
        'gradient-hero': 'var(--gradient-hero)',
        'gradient-mesh': 'var(--gradient-mesh)',
        'gradient-card-overlay': 'var(--gradient-card-overlay)',
        'gradient-glass': 'var(--gradient-glass)',
        'hero-pattern': "radial-gradient(ellipse 80% 50% at 50% -20%,rgba(120,119,198,0.3),hsla(0,0%,100%,0))",
      },
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		function({ addUtilities }) {
		  const newUtilities = {
			".text-gradient-gold": {
			  background: 'var(--gradient-gold)',
			  "-webkit-background-clip": "text",
			  "-webkit-text-fill-color": "transparent",
			  "background-clip": "text",
			  "text-fill-color": "transparent",
			},
		  }
		  addUtilities(newUtilities)
		}
	  ],
} satisfies Config;
