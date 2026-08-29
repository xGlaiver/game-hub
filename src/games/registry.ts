/**
 * Registro dei giochi della piattaforma.
 *
 * Aggiungere un gioco = aggiungere una voce qui + creare la rotta in
 * `src/app/<slug>/`. La home, la navigazione e le pagine dei giochi leggono
 * tutte da qui, quindi non c'e nessun altro posto da aggiornare.
 */

export type GameStatus = "disponibile" | "in-arrivo";

export type GameAccent = "lime" | "magenta" | "ciano" | "ambra";

export type Game = {
    /** Segmento di URL: /abaco */
    slug: string;
    name: string;
    /** Sottotitolo breve mostrato sulla card e in cima alla pagina del gioco. */
    tagline: string;
    /** Frase piu lunga: le regole in una riga. */
    description: string;
    players: string;
    duration: string;
    difficulty: "facile" | "medio" | "tosto";
    /** Colore che identifica il gioco in tutta la piattaforma. */
    accent: GameAccent;
    status: GameStatus;
};

export const games: Game[] = [
    {
        slug: "abaco",
        name: "Abaco Zuzzurellone",
        tagline: "Stringi il cerchio, lettera dopo lettera",
        description:
            "Il Giocatore 1 nasconde una parola. Il Giocatore 2 la cerca a tentativi, mentre l'intervallo alfabetico si stringe a ogni mossa.",
        players: "2 giocatori",
        duration: "5 min",
        difficulty: "medio",
        accent: "lime",
        status: "disponibile",
    },
];

export const getGame = (slug: string): Game | undefined =>
    games.find((game) => game.slug === slug);

export const playableGames = games.filter(
    (game) => game.status === "disponibile",
);
