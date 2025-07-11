import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			'@style': path.resolve(__dirname, './src/style/index.css'),
		},
	},
	plugins: [react(), tailwindcss()],
})
