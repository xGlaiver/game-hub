import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// Su Windows path.resolve usa i backslash: Vite vuole gli slash normali.
const srcDir = path
    .resolve(import.meta.dirname, "src")
    .split(path.sep)
    .join("/");

export default defineConfig({
    plugins: [react()],
    resolve: {
        // Replica la risoluzione via `baseUrl: "src/"` del tsconfig,
        // usata dagli import tipo `utils/string_manipulation`.
        alias: [{ find: /^utils\//, replacement: `${srcDir}/utils/` }],
    },
    test: {
        environment: "jsdom",
        globals: false,
        setupFiles: ["./vitest.setup.ts"],
        include: ["src/**/*.test.{ts,tsx}"],
    },
});
