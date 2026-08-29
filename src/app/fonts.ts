import { Azeret_Mono, Barlow, Bungee } from "next/font/google";

/**
 * Insegna serigrafata. Solo 400: Bungee non ha altri pesi.
 * Vive in DUE POSTI e basta — wordmark dell'header e lockup H1 delle pagine.
 * Altrove si usa Barlow 800 uppercase: Bungee e ultra-larga e manda in
 * overflow parole lunghe come "Zuzzurellone".
 */
export const bungee = Bungee({
    weight: "400",
    subsets: ["latin", "latin-ext"],
    display: "swap",
    variable: "--font-bungee",
});

/** Testo corrente e titoli delle card. */
export const barlow = Barlow({
    weight: ["400", "500", "700", "800"],
    subsets: ["latin", "latin-ext"],
    display: "swap",
    variable: "--font-barlow",
});

/** Decal, HUD, cifre. */
export const azeret = Azeret_Mono({
    weight: ["500", "700"],
    subsets: ["latin", "latin-ext"],
    display: "swap",
    variable: "--font-azeret",
});
