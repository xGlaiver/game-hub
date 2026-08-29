import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import AbacoPageClient from "./client";

type User = ReturnType<typeof userEvent.setup>;

const setup = (): User => {
    const user = userEvent.setup({ delay: null });
    render(<AbacoPageClient />);
    return user;
};

const input = () => screen.getByRole("textbox");
const confirmButton = () => screen.getByRole("button", { name: "Conferma" });
const range = () => screen.getByText(/ - /);
const attempts = () => screen.getByText(/Numero di tentativi:/);

/**
 * Riscrive il campo da zero e conferma col bottone. La `clear` serve perche
 * un tentativo rifiutato resta nel campo, pronto per essere corretto.
 */
const submit = async (user: User, word: string) => {
    await user.clear(input());
    await user.type(input(), word);
    await user.click(confirmButton());
};

/** Avvia una partita con "melone" come parola segreta. */
const startGame = async (user: User) => submit(user, "melone");

describe("turno del Giocatore 1", () => {
    it("mostra il form per la parola segreta all'avvio", () => {
        setup();

        expect(
            screen.getByRole("heading", { name: /Giocatore 1/ }),
        ).toBeInTheDocument();
        expect(input()).toHaveValue("");
    });

    it("segnala l'errore se si conferma senza scrivere nulla", async () => {
        const user = setup();

        await user.click(confirmButton());

        expect(
            screen.getByText("La parola non può essere vuota"),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("heading", { name: /Giocatore 1/ }),
        ).toBeInTheDocument();
    });

    // Una parola fuori dal range renderebbe la partita impossibile:
    // ogni tentativo utile verrebbe respinto come "fuori dal range".
    it.each(["zzz", "abaco", "zuzzurellone", "aaa"])(
        "rifiuta %s perche fuori dal range Abaco - Zuzzurellone",
        async (word) => {
            const user = setup();

            await submit(user, word);

            expect(
                screen.getByText(
                    "La parola deve essere compresa tra Abaco e Zuzzurellone",
                ),
            ).toBeInTheDocument();
            expect(
                screen.getByRole("heading", { name: /Giocatore 1/ }),
            ).toBeInTheDocument();
        },
    );

    it("passa al Giocatore 2 con il range completo e zero tentativi", async () => {
        const user = setup();

        await startGame(user);

        expect(
            screen.getByRole("heading", { name: /Giocatore 2/ }),
        ).toBeInTheDocument();
        expect(range()).toHaveTextContent("Abaco - Zuzzurellone");
        expect(attempts()).toHaveTextContent("Numero di tentativi: 0");
    });

    it("conferma la parola anche col tasto Invio", async () => {
        const user = setup();

        await user.type(input(), "melone{Enter}");

        expect(
            screen.getByRole("heading", { name: /Giocatore 2/ }),
        ).toBeInTheDocument();
    });

    it("non lascia digitare cifre o punteggiatura", async () => {
        const user = setup();

        await user.type(input(), "Ciao123!");

        expect(input()).toHaveValue("ciao");
    });

    // NOTA: normalize_string fa il trim a ogni battuta, quindi lo spazio
    // non arriva mai a essere scartato dal filtro /^[a-z]*$/.
    it("ignora gli spazi digitati dentro la parola", async () => {
        const user = setup();

        await user.type(input(), "ci ao");

        expect(input()).toHaveValue("ciao");
    });
});

describe("turno del Giocatore 2", () => {
    it("segnala l'errore se si conferma senza scrivere nulla", async () => {
        const user = setup();
        await startGame(user);

        await user.click(confirmButton());

        expect(
            screen.getByText("La parola non può essere vuota"),
        ).toBeInTheDocument();
        expect(attempts()).toHaveTextContent("Numero di tentativi: 0");
    });

    it("nasconde l'errore dopo un tentativo valido", async () => {
        const user = setup();
        await startGame(user);

        await user.click(confirmButton());

        expect(
            screen.getByText("La parola non può essere vuota"),
        ).toBeInTheDocument();
        expect(attempts()).toHaveTextContent("Numero di tentativi: 0");

        await submit(user, "carota");

        expect(
            screen.queryByText("La parola non può essere vuota"),
        ).not.toBeInTheDocument();
        expect(input()).toHaveValue("");
        expect(attempts()).toHaveTextContent("Numero di tentativi: 1");

    });

    it("segnala un tentativo fuori dal range senza consumarlo", async () => {
        const user = setup();
        await startGame(user);

        await submit(user, "zzz");

        expect(
            screen.getByText("La parola inserita è fuori dal range"),
        ).toBeInTheDocument();
        expect(attempts()).toHaveTextContent("Numero di tentativi: 0");
        expect(range()).toHaveTextContent("Abaco - Zuzzurellone");
    });

    it("alza il limite inferiore con un tentativo troppo basso", async () => {
        const user = setup();
        await startGame(user);

        await submit(user, "carota");

        expect(range()).toHaveTextContent("Carota - Zuzzurellone");
        expect(attempts()).toHaveTextContent("Numero di tentativi: 1");
    });

    it("abbassa il limite superiore con un tentativo troppo alto", async () => {
        const user = setup();
        await startGame(user);

        await submit(user, "patata");

        expect(range()).toHaveTextContent("Abaco - Patata");
        expect(attempts()).toHaveTextContent("Numero di tentativi: 1");
    });

    it("lascia nel campo il tentativo rifiutato, pronto da correggere", async () => {
        const user = setup();
        await startGame(user);

        await submit(user, "zzz");

        expect(input()).toHaveValue("zzz");
    });

    it("svuota il campo e l'errore dopo un tentativo valido", async () => {
        const user = setup();
        await startGame(user);
        await submit(user, "zzz");

        await submit(user, "carota");

        expect(input()).toHaveValue("");
        expect(
            screen.queryByText("La parola inserita è fuori dal range"),
        ).not.toBeInTheDocument();
    });

    it("non rivela mai la parola segreta durante la partita", async () => {
        const user = setup();
        await startGame(user);

        await submit(user, "carota");

        expect(screen.queryByText(/melone/i)).not.toBeInTheDocument();
    });

    it("conferma il tentativo anche col tasto Invio", async () => {
        const user = setup();
        await startGame(user);

        await user.type(input(), "carota{Enter}");

        expect(range()).toHaveTextContent("Carota - Zuzzurellone");
    });

    it("restringe il range progressivamente lungo la partita", async () => {
        const user = setup();
        await startGame(user);

        await submit(user, "carota");
        expect(range()).toHaveTextContent("Carota - Zuzzurellone");

        await submit(user, "patata");
        expect(range()).toHaveTextContent("Carota - Patata");

        await submit(user, "nespola");
        expect(range()).toHaveTextContent("Carota - Nespola");

        // "banana" e ormai fuori dai limiti aggiornati.
        await submit(user, "banana");
        expect(
            screen.getByText("La parola inserita è fuori dal range"),
        ).toBeInTheDocument();
        expect(attempts()).toHaveTextContent("Numero di tentativi: 3");
    });

    it("chiede conferma prima di far arrendere", async () => {
        const user = setup();
        await startGame(user);

        await user.click(screen.getByRole("button", { name: "Mi arrendo" }));

        expect(screen.getByRole("dialog")).toBeInTheDocument();
        // la partita non e ancora persa: siamo sempre sul turno del Giocatore 2
        expect(
            screen.getByRole("heading", { name: /Giocatore 2/ }),
        ).toBeInTheDocument();
    });

    it("torna al gioco se si annulla la resa", async () => {
        const user = setup();
        await startGame(user);

        await user.click(screen.getByRole("button", { name: "Mi arrendo" }));
        await user.click(
            screen.getByRole("button", { name: "Continua a giocare" }),
        );

        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        expect(range()).toHaveTextContent("Abaco - Zuzzurellone");
    });

    it("chiude il modale anche col tasto Escape", async () => {
        const user = setup();
        await startGame(user);

        await user.click(screen.getByRole("button", { name: "Mi arrendo" }));
        await user.keyboard("{Escape}");

        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        expect(
            screen.getByRole("heading", { name: /Giocatore 2/ }),
        ).toBeInTheDocument();
    });

    it("perde la partita quando si conferma la resa", async () => {
        const user = setup();
        await startGame(user);

        await user.click(screen.getByRole("button", { name: "Mi arrendo" }));
        await user.click(screen.getByRole("button", { name: "Sì, mi arrendo" }));

        expect(
            screen.getByRole("heading", { name: /hai perso/i }),
        ).toBeInTheDocument();
        expect(screen.getByText("melone")).toBeInTheDocument();
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
});

describe("vittoria", () => {
    it("mostra la parola indovinata e il numero di tentativi", async () => {
        const user = setup();
        await startGame(user);

        await submit(user, "carota");
        await submit(user, "patata");
        await submit(user, "melone");

        expect(
            screen.getByRole("heading", { name: /Complimenti/ }),
        ).toBeInTheDocument();
        expect(screen.getByText("melone")).toBeInTheDocument();
        expect(attempts()).toHaveTextContent("Numero di tentativi: 3");
    });

    it("nasconde il campo del tentativo", async () => {
        const user = setup();
        await startGame(user);

        await submit(user, "melone");

        expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
        expect(
            screen.queryByRole("button", { name: "Conferma" }),
        ).not.toBeInTheDocument();
    });

    it("Gioca di nuovo riporta al Giocatore 1 con lo stato pulito", async () => {
        const user = setup();
        await startGame(user);
        await submit(user, "carota");
        await submit(user, "melone");

        await user.click(screen.getByRole("button", { name: "Gioca di nuovo" }));

        expect(
            screen.getByRole("heading", { name: /Giocatore 1/ }),
        ).toBeInTheDocument();
        expect(input()).toHaveValue("");

        // La partita successiva riparte davvero da zero.
        await submit(user, "nespola");
        expect(range()).toHaveTextContent("Abaco - Zuzzurellone");
        expect(attempts()).toHaveTextContent("Numero di tentativi: 0");
    });
});
