import { describe, expect, it } from "vitest";
import {
    capitalizeFirstLetter,
    normalize_string,
} from "utils/string_manipulation";

describe("capitalizeFirstLetter", () => {
    it("rende maiuscola la prima lettera", () => {
        expect(capitalizeFirstLetter("abaco")).toBe("Abaco");
    });

    it("rende minuscolo il resto della parola", () => {
        expect(capitalizeFirstLetter("ZUZZURELLONE")).toBe("Zuzzurellone");
        expect(capitalizeFirstLetter("aBaCo")).toBe("Abaco");
    });

    it("gestisce una parola di un solo carattere", () => {
        expect(capitalizeFirstLetter("a")).toBe("A");
    });

    it("restituisce la stringa vuota se riceve la stringa vuota", () => {
        expect(capitalizeFirstLetter("")).toBe("");
    });

});

describe("normalize_string", () => {
    it("rimuove gli spazi iniziali e finali", () => {
        expect(normalize_string("   abaco   ")).toBe("abaco");
    });

    it("porta tutto in minuscolo", () => {
        expect(normalize_string("Zuzzurellone")).toBe("zuzzurellone");
    });

    it("lascia invariata una parola gia normalizzata", () => {
        expect(normalize_string("melone")).toBe("melone");
    });

    it("riduce a stringa vuota una stringa di soli spazi", () => {
        expect(normalize_string("     ")).toBe("");
    });

    // NOTA: gli spazi interni non vengono rimossi. Il gioco si affida al
    // filtro /^[a-z]*$/ del reducer per scartare questi valori.
    it("non rimuove gli spazi interni alla parola", () => {
        expect(normalize_string("  Ci Ao  ")).toBe("ci ao");
    });
});
