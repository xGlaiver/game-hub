import { describe, expect, it } from "vitest";
import {
    gameReducer,
    GameStatus,
    initialState,
    type InitialState as GameState,
} from "./GameReducer";

const stateWith = (overrides: Partial<GameState> = {}): GameState => ({
    ...initialState,
    ...overrides,
});

/** Stato di una partita gia avviata, con "melone" come parola segreta. */
const playing = (overrides: Partial<GameState> = {}): GameState =>
    stateWith({
        wordToGuess: "melone",
        gameStatus: GameStatus.Playing,
        ...overrides,
    });

describe("stato iniziale", () => {
    it("parte dal turno del Giocatore 1 con il range completo", () => {
        expect(initialState).toEqual({
            wordToGuess: "",
            currentGuess: "",
            gameStatus: GameStatus.Start,
            numberAttempts: 0,
            startWord: "Abaco",
            endWord: "Zuzzurellone",
            errorMessage: "",
        });
    });
});

describe("set_word_to_guess", () => {
    it("accetta una parola in minuscolo", () => {
        const next = gameReducer(initialState, {
            type: "set_word_to_guess",
            payload: "melone",
        });

        expect(next.wordToGuess).toBe("melone");
    });

    it("accetta la stringa vuota, cosi l'utente puo cancellare l'input", () => {
        const next = gameReducer(stateWith({ wordToGuess: "melone" }), {
            type: "set_word_to_guess",
            payload: "",
        });

        expect(next.wordToGuess).toBe("");
    });

    it.each([
        ["le maiuscole", "Melone"],
        ["le cifre", "melone1"],
        ["gli spazi interni", "melone rosso"],
        ["le lettere accentate", "perché"],
        ["la punteggiatura", "melone!"],
    ])("scarta %s lasciando lo stato invariato", (_caso, payload) => {
        const previous = stateWith({ wordToGuess: "melone" });

        const next = gameReducer(previous, {
            type: "set_word_to_guess",
            payload,
        });

        expect(next).toBe(previous);
    });

    it("non tocca le altre proprieta dello stato", () => {
        const next = gameReducer(initialState, {
            type: "set_word_to_guess",
            payload: "melone",
        });

        expect(next.gameStatus).toBe(GameStatus.Start);
        expect(next.numberAttempts).toBe(0);
        expect(next.startWord).toBe("Abaco");
        expect(next.endWord).toBe("Zuzzurellone");
    });
});

describe("set_current_guess", () => {
    it("accetta un tentativo in minuscolo", () => {
        const next = gameReducer(playing(), {
            type: "set_current_guess",
            payload: "carota",
        });

        expect(next.currentGuess).toBe("carota");
    });

    it.each([
        ["le maiuscole", "Carota"],
        ["le cifre", "carota2"],
        ["gli spazi interni", "carota rossa"],
    ])("scarta %s lasciando lo stato invariato", (_caso, payload) => {
        const previous = playing({ currentGuess: "carota" });

        const next = gameReducer(previous, {
            type: "set_current_guess",
            payload,
        });

        expect(next).toBe(previous);
    });
});

describe("enter_word_to_guess", () => {
    it("avvia la partita con una parola dentro il range", () => {
        const next = gameReducer(stateWith({ wordToGuess: "melone" }), {
            type: "enter_word_to_guess",
        });

        expect(next.gameStatus).toBe(GameStatus.Playing);
        expect(next.errorMessage).toBe("");
    });

    it("cancella un errore precedente quando la parola e valida", () => {
        const next = gameReducer(
            stateWith({
                wordToGuess: "melone",
                errorMessage: "La parola non puo essere vuota",
            }),
            { type: "enter_word_to_guess" },
        );

        expect(next.errorMessage).toBe("");
    });

    it("rifiuta la parola vuota e resta sul turno del Giocatore 1", () => {
        const next = gameReducer(initialState, {
            type: "enter_word_to_guess",
        });

        expect(next.errorMessage).toBe("La parola non può essere vuota");
        expect(next.gameStatus).toBe(GameStatus.Start);
    });

    it("rifiuta una parola fatta di soli spazi", () => {
        const next = gameReducer(stateWith({ wordToGuess: "   " }), {
            type: "enter_word_to_guess",
        });

        expect(next.errorMessage).toBe("La parola non può essere vuota");
        expect(next.gameStatus).toBe(GameStatus.Start);
    });

    // Senza questo controllo il Giocatore 1 potrebbe scegliere una parola
    // che il Giocatore 2 non ha modo di indovinare: ogni tentativo utile
    // verrebbe respinto come "fuori dal range".
    it.each([
        ["viene prima di Abaco", "aaa"],
        ["coincide con Abaco", "abaco"],
        ["coincide con Zuzzurellone", "zuzzurellone"],
        ["viene dopo Zuzzurellone", "zzz"],
    ])("rifiuta una parola segreta che %s", (_caso, wordToGuess) => {
        const next = gameReducer(stateWith({ wordToGuess }), {
            type: "enter_word_to_guess",
        });

        expect(next.errorMessage).toBe(
            "La parola deve essere compresa tra Abaco e Zuzzurellone",
        );
        expect(next.gameStatus).toBe(GameStatus.Start);
    });

    it.each([
        ["subito dopo Abaco", "abacos"],
        ["subito prima di Zuzzurellone", "zuzzurellond"],
    ])("accetta una parola segreta che sta %s", (_caso, wordToGuess) => {
        const next = gameReducer(stateWith({ wordToGuess }), {
            type: "enter_word_to_guess",
        });

        expect(next.gameStatus).toBe(GameStatus.Playing);
        expect(next.errorMessage).toBe("");
    });
});

describe("try_to_guess_word", () => {
    it("rifiuta un tentativo vuoto", () => {
        const next = gameReducer(playing(), { type: "try_to_guess_word" });

        expect(next.errorMessage).toBe("La parola non può essere vuota");
        expect(next.gameStatus).toBe(GameStatus.Playing);
    });

    it.each([
        ["coincide con il limite inferiore", "abaco"],
        ["coincide con il limite superiore", "zuzzurellone"],
        ["sta prima del limite inferiore", "aaa"],
        ["sta dopo il limite superiore", "zzz"],
    ])("segnala un tentativo che %s", (_caso, currentGuess) => {
        const next = gameReducer(playing({ currentGuess }), {
            type: "try_to_guess_word",
        });

        expect(next.errorMessage).toBe("La parola inserita è fuori dal range");
        expect(next.gameStatus).toBe(GameStatus.Playing);
    });

    // NOTA: comportamento voluto. Un tentativo fuori range non e un tentativo.
    it("non conta come tentativo una parola fuori dal range", () => {
        const next = gameReducer(
            playing({ currentGuess: "zzz", numberAttempts: 4 }),
            { type: "try_to_guess_word" },
        );

        expect(next.numberAttempts).toBe(4);
        expect(next.startWord).toBe("Abaco");
        expect(next.endWord).toBe("Zuzzurellone");
    });

    it("mantiene il tentativo nel campo quando viene rifiutato", () => {
        const next = gameReducer(playing({ currentGuess: "zzz" }), {
            type: "try_to_guess_word",
        });

        expect(next.currentGuess).toBe("zzz");
    });

    it("alza il limite inferiore con un tentativo troppo basso", () => {
        const next = gameReducer(playing({ currentGuess: "carota" }), {
            type: "try_to_guess_word",
        });

        expect(next.startWord).toBe("Carota");
        expect(next.endWord).toBe("Zuzzurellone");
        expect(next.gameStatus).toBe(GameStatus.Playing);
        expect(next.numberAttempts).toBe(1);
    });

    it("abbassa il limite superiore con un tentativo troppo alto", () => {
        const next = gameReducer(playing({ currentGuess: "patata" }), {
            type: "try_to_guess_word",
        });

        expect(next.startWord).toBe("Abaco");
        expect(next.endWord).toBe("Patata");
        expect(next.gameStatus).toBe(GameStatus.Playing);
        expect(next.numberAttempts).toBe(1);
    });

    it("svuota il campo e l'errore dopo un tentativo valido", () => {
        const next = gameReducer(
            playing({
                currentGuess: "carota",
                errorMessage: "La parola inserita è fuori dal range",
            }),
            { type: "try_to_guess_word" },
        );

        expect(next.currentGuess).toBe("");
        expect(next.errorMessage).toBe("");
    });

    it("dichiara la vittoria quando il tentativo coincide con la parola", () => {
        const next = gameReducer(
            playing({ currentGuess: "melone", numberAttempts: 2 }),
            { type: "try_to_guess_word" },
        );

        expect(next.gameStatus).toBe(GameStatus.Won);
        expect(next.numberAttempts).toBe(3);
        expect(next.wordToGuess).toBe("melone");
    });

    it("restringe il range a ogni tentativo di una partita intera", () => {
        let state = gameReducer(stateWith({ wordToGuess: "melone" }), {
            type: "enter_word_to_guess",
        });

        state = gameReducer({ ...state, currentGuess: "carota" }, {
            type: "try_to_guess_word",
        });
        expect([state.startWord, state.endWord]).toEqual([
            "Carota",
            "Zuzzurellone",
        ]);

        state = gameReducer({ ...state, currentGuess: "patata" }, {
            type: "try_to_guess_word",
        });
        expect([state.startWord, state.endWord]).toEqual(["Carota", "Patata"]);

        state = gameReducer({ ...state, currentGuess: "nespola" }, {
            type: "try_to_guess_word",
        });
        expect([state.startWord, state.endWord]).toEqual(["Carota", "Nespola"]);

        state = gameReducer({ ...state, currentGuess: "melone" }, {
            type: "try_to_guess_word",
        });
        expect(state.gameStatus).toBe(GameStatus.Won);
        expect(state.numberAttempts).toBe(4);
    });

    it("rifiuta un tentativo gia escluso dai limiti aggiornati", () => {
        const afterCarota = gameReducer(playing({ currentGuess: "carota" }), {
            type: "try_to_guess_word",
        });

        const next = gameReducer(
            { ...afterCarota, currentGuess: "banana" },
            { type: "try_to_guess_word" },
        );

        expect(next.errorMessage).toBe("La parola inserita è fuori dal range");
        expect(next.numberAttempts).toBe(afterCarota.numberAttempts);
    });

    it("rifiuta un tentativo se la partita non è in corso", () => {
        const next = gameReducer(stateWith({gameStatus: GameStatus.Start}), {
            type: "try_to_guess_word",
        })

        expect(next).toEqual({...initialState, errorMessage: "Non puoi indovinare la parola se non hai ancora inserito la parola da indovinare"})
    })
});

describe("reset", () => {
    it("riporta allo stato iniziale dopo una vittoria", () => {
        const won = playing({
            gameStatus: GameStatus.Won,
            numberAttempts: 7,
            startWord: "Carota",
            endWord: "Patata",
        });

        expect(gameReducer(won, { type: "reset" })).toEqual(initialState);
    });

    it("riporta allo stato iniziale a partita in corso", () => {
        const inCorso = playing({
            currentGuess: "carota",
            numberAttempts: 3,
            errorMessage: "La parola inserita è fuori dal range",
        });

        expect(gameReducer(inCorso, { type: "reset" })).toEqual(initialState);
    });
});

describe("azione sconosciuta", () => {
    it("lascia lo stato invariato", () => {
        const previous = playing({ numberAttempts: 2 });

        expect(gameReducer(previous, { type: "boh" } as never)).toBe(previous);
    });
});
