import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig(() => {
	const env = loadEnv("development", process.cwd(), "");
	return {
		plugins: [react(), tailwindcss(), tsconfigPaths()],
		define: {},
		resolve: {
			preserveSymlinks: true,
			alias: {
				"#test": path.resolve(__dirname, "./test"),
				"#dev": path.resolve(__dirname, "./dev"),
				"@": path.resolve(__dirname, "./src"),
			},
		},
		test: {
			environment: "happy-dom",
			globals: true,
			setupFiles: ["./dev/vitest/vitest.setup.ts"],
			include: [
				"./src/**/*.{test,spec}.(c|m)?[tj]s(x)?",
				"./src/**/__test__/**/*.(c|m)?[tj]s(x)?",
			],
			exclude: ["**\/node_modules/**", "**\/.git/**"],
			reporters: ["html", "junit", "json", "verbose"],
			outputFile: {
				junit: "./reports/junit-report.xml",
				json: "./reports/json-report.json",
				html: "./reports/html-report.html",
			},
			coverage: {
				include: ["./src"],
				reporter: ["text", "json", "html"],
				reportOnFailure: true,
				reportsDirectory: "./reports/coverage",
			},
		},
	};
});
