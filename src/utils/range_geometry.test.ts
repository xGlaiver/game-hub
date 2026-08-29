import { describe, expect, it } from "vitest";
import { analyzeRange } from "$/utils/range_geometry";

describe("analyzeRange", () => {
    it("a inizio partita apre la striscia da a a z", () => {
        const g = analyzeRange("Abaco", "Zuzzurellone");

        expect(g.depth).toBe(0);
        expect(g.fromPos).toBeCloseTo(0, 1);
        expect(g.toPos).toBeGreaterThan(24);
    });

    it("conta le lettere iniziali ormai certe", () => {
        expect(analyzeRange("Melanzana", "Melone").depth).toBe(3);
    });

    it("ignora le maiuscole nel calcolo del prefisso", () => {
        expect(analyzeRange("Melanzana", "melone").depth).toBe(3);
    });

    it("non conta lettere certe se gli estremi partono diversi", () => {
        expect(analyzeRange("Carota", "Patata").depth).toBe(0);
    });

    // Il punto della funzione: quando i due estremi guadagnano lettere in
    // comune la striscia si ri-scala sulla posizione ancora aperta, invece
    // di schiacciarsi in un segmento invisibile.
    it("si ri-scala quando gli estremi guadagnano lettere in comune", () => {
        const largo = analyzeRange("Mela", "Pesca");
        const stretto = analyzeRange("Melanzana", "Melone");

        expect(largo.depth).toBe(0);
        expect(stretto.depth).toBe(3);
        expect(stretto.toPos - stretto.fromPos).toBeGreaterThan(1);
    });

    it("posiziona ogni estremo sulla sua lettera aperta", () => {
        // "mel" bloccato: restano 'a' (0) e 'o' (14) in quarta posizione
        const g = analyzeRange("Melanzana", "Melone");

        expect(Math.floor(g.fromPos)).toBe(0);
        expect(Math.floor(g.toPos)).toBe(14);
    });

    it("distingue due code diverse sotto la stessa lettera", () => {
        const a = analyzeRange("Ma", "Zuzzurellone");
        const b = analyzeRange("Mz", "Zuzzurellone");

        expect(Math.floor(a.fromPos)).toBe(Math.floor(b.fromPos));
        expect(b.fromPos).toBeGreaterThan(a.fromPos);
    });

    it.each([
        ["Abaco", "Zuzzurellone"],
        ["Melanzana", "Melone"],
        ["Carota", "Patata"],
        ["Abaco", "Abacos"],
        ["Melone", "Melone"],
    ])("tiene le paratie dentro la striscia con %s - %s", (start, end) => {
        const g = analyzeRange(start, end);

        expect(g.fromPos).toBeGreaterThanOrEqual(0);
        expect(g.toPos).toBeLessThanOrEqual(26);
        expect(g.toPos).toBeGreaterThanOrEqual(g.fromPos);
    });

    it("gestisce un estremo che e prefisso dell'altro", () => {
        const g = analyzeRange("Abaco", "Abacos");

        expect(g.depth).toBe(5);
        expect(g.fromPos).toBe(0);
        expect(Math.floor(g.toPos)).toBe(18); // 's'
    });
});
