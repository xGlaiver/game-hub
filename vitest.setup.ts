import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// `globals: false` disattiva l'auto-cleanup di Testing Library.
afterEach(() => {
    cleanup();
});
