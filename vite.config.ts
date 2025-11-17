import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
// https://vite.dev/config/
export default defineConfig({
	base: './',
	resolve: {
		alias: {
			'@style': path.resolve(__dirname, './src/shared/style/index.css'),
			'@ui': path.resolve(__dirname, './src/shared/ui'),
			'@t': path.resolve(__dirname as any, './src/layout'),
		},
	},
	plugins: [react(), tailwindcss(), tsconfigPaths()],
	server: {
		host: true,
		port: 3200,
		open: true,
	},
	build: {
		target: 'esnext',
		outDir: 'build',
	},
	optimizeDeps: {
		include: ['axios'],
	},
})
