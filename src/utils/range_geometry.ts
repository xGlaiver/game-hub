/**
 * Geometria del binario di Abaco: traduce i due estremi alfabetici in
 * coordinate disegnabili su una striscia a-z.
 *
 * L'idea: le lettere iniziali su cui i due estremi ormai coincidono sono
 * *certe*, quindi escono dal gioco. La striscia mostra sempre la prima
 * posizione ancora aperta. Cosi il binario non si schiaccia mai: quando gli
 * estremi guadagnano una lettera in comune, la striscia si ri-scala su quella
 * successiva e il movimento torna visibile.
 */

const ALPHABET_SIZE = 26;
const CODE_A = 97;

/** Le lettere della striscia, da disegnare sotto al binario. */
export const ALPHABET = Array.from({ length: ALPHABET_SIZE }, (_, i) =>
    String.fromCharCode(CODE_A + i),
);

export type RangeGeometry = {
    /** Quante lettere iniziali sono ormai identiche nei due estremi. */
    depth: number;
    /** Paratia sinistra sulla striscia, in [0, 26]. */
    fromPos: number;
    /** Paratia destra sulla striscia, in [0, 26]. */
    toPos: number;
};

/**
 * Posizione frazionaria dentro una singola lettera, guardando le tre
 * successive. Serve solo a distinguere code diverse sotto la stessa lettera
 * ("ma" sta appena prima di "mz"): sposta la paratia di frazioni di casella.
 */
const subPosition = (tail: string, lookahead = 3): number => {
    let value = 0;
    let weight = 1;

    for (let i = 0; i < lookahead; i++) {
        weight /= ALPHABET_SIZE;
        const code = i < tail.length ? tail.charCodeAt(i) - CODE_A : 0;
        value += Math.min(Math.max(code, 0), ALPHABET_SIZE - 1) * weight;
    }

    return value;
};

export function analyzeRange(startWord: string, endWord: string): RangeGeometry {
    const start = startWord.toLowerCase();
    const end = endWord.toLowerCase();

    let depth = 0;
    while (
        depth < start.length &&
        depth < end.length &&
        start[depth] === end[depth]
    ) {
        depth++;
    }

    // Un estremo esaurito sta al bordo: se startWord e prefisso di endWord,
    // la paratia sinistra e a inizio striscia.
    const startLetter = depth < start.length ? start.charCodeAt(depth) - CODE_A : -1;
    const endLetter =
        depth < end.length ? end.charCodeAt(depth) - CODE_A : ALPHABET_SIZE;

    const fromPos =
        startLetter < 0 ? 0 : startLetter + subPosition(start.slice(depth + 1));
    const toPos = Math.min(
        ALPHABET_SIZE,
        endLetter + subPosition(end.slice(depth + 1)),
    );

    return { depth, fromPos, toPos: Math.max(fromPos, toPos) };
}
