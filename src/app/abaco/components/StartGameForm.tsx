import { useId, useState } from "react";
import { normalize_string } from "$/utils/string_manipulation";

type Props = {
    wordToGuess: string;
    setWordToGuess: (word: string) => void;
    onEnter: () => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    errorId?: string;
    hasError?: boolean;
};

const StartGameForm = ({
    wordToGuess,
    setWordToGuess,
    onEnter,
    onKeyDown,
    errorId,
    hasError = false,
}: Props) => {
    const inputId = useId();
    // Il Giocatore 2 e nella stessa stanza: la parola non deve stare in
    // chiaro sullo schermo. Resta type="text" per non perdere il ruolo
    // textbox; a mascherare ci pensa -webkit-text-security.
    const [mostraParola, setMostraParola] = useState(false);

    return (
        <div className="pannello p-5 sm:p-6">
            <p className="inline-flex items-center rounded-targa border-2 border-ink-dark bg-accent px-2 py-0.5 font-decal text-decal uppercase text-ink-dark">
                1UP
            </p>

            <h2 className="mt-3 font-testo text-titolo uppercase text-ink">
                Giocatore 1, nascondi una parola
            </h2>
            <p className="mt-1 text-body-sm text-ink-muted">
                Solo lettere minuscole, senza spazi. Deve stare fra Abaco e
                Zuzzurellone.
            </p>

            <label
                htmlFor={inputId}
                className="mt-5 block font-decal text-decal uppercase text-ink-muted"
            >
                Parola segreta
            </label>

            <div className="relative mt-2">
                <input
                    id={inputId}
                    className={`fessura pr-28 ${mostraParola ? "" : "fessura-mascherata"}`}
                    type="text"
                    autoComplete="off"
                    spellCheck={false}
                    aria-invalid={hasError}
                    aria-describedby={hasError ? errorId : undefined}
                    value={wordToGuess}
                    onChange={(e) =>
                        setWordToGuess(normalize_string(e.target.value))
                    }
                    onKeyDown={onKeyDown}
                />
                <button
                    type="button"
                    className="cap-quieto absolute top-1/2 right-2 -translate-y-1/2 px-2! py-1!"
                    aria-pressed={mostraParola}
                    onClick={() => setMostraParola((v) => !v)}
                >
                    {mostraParola ? "Nascondi" : "Mostra"}
                </button>
            </div>

            <button className="cap mt-4" onClick={onEnter}>
                Conferma
            </button>
        </div>
    );
};

export default StartGameForm;
