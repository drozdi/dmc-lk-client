import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
// https://vite.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");
	return {
		base: env.NODE_ENV === "development" ? "" : "/lk",
		resolve: {
			alias: {
				"@style": path.resolve(__dirname, "./src/shared/style/index.css"),
				"@": path.resolve(__dirname, "./src"),
				"#": path.resolve(__dirname, "."),
			},
		},
		plugins: [react(), tailwindcss(), tsconfigPaths()],
		server: {
			host: env.VITE_SERVER_HOST || true,
			port: parseInt(env.VITE_SERVER_PORT || "3200", 10) || 3200,
			open: env.VITE_SERVER_OPEN === "true",
		},
		build: {
			target: "esnext",
			outDir: "build",
		},
		optimizeDeps: {
			include: ["axios"],
		},
		define: {},
		css: {
			postcss: "./postcss.config.js",
		},
	};
});
