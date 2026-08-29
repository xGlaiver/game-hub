import { useId, useState } from "react";
import { normalize_string } from "$/utils/string_manipulation";
import Modal from "$/app/components/Modal";
import RangeRail from "./RangeRail";
import AttemptCounter from "./AttemptCounter";

type Props = {
    currentGuess: string;
    startWord: string;
    endWord: string;
    numberAttempts: number;
    setCurrentGuess: (word: string) => void;
    onEnter: () => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onGiveUp: () => void;
    errorId?: string;
    hasError?: boolean;
};

const PlayingGameScreen = ({
    currentGuess,
    startWord,
    endWord,
    numberAttempts,
    setCurrentGuess,
    onEnter,
    onKeyDown,
    onGiveUp,
    errorId,
    hasError = false,
}: Props) => {
    const inputId = useId();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex flex-col gap-4">
            <div className="pannello p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="inline-flex items-center rounded-targa border-2 border-ink-dark bg-info px-2 py-0.5 font-decal text-decal uppercase text-ink-dark">
                        2UP
                    </p>
                    <AttemptCounter value={numberAttempts} />
                </div>

                <h2 className="mt-3 font-testo text-titolo uppercase text-ink">
                    Giocatore 2, indovina la parola
                </h2>

                <label
                    htmlFor={inputId}
                    className="mt-5 block font-decal text-decal uppercase text-ink-muted"
                >
                    Il tuo tentativo
                </label>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                    <input
                        id={inputId}
                        className="fessura max-w-xs"
                        type="text"
                        autoComplete="off"
                        spellCheck={false}
                        aria-invalid={hasError}
                        aria-describedby={hasError ? errorId : undefined}
                        value={currentGuess}
                        onChange={(e) =>
                            setCurrentGuess(normalize_string(e.target.value))
                        }
                        onKeyDown={onKeyDown}
                    />
                    <button className="cap" onClick={onEnter}>
                        Conferma
                    </button>
                </div>

                <button
                    className="cap-quieto mt-6"
                    onClick={() => setIsOpen(true)}
                >
                    Mi arrendo
                </button>
            </div>

            <RangeRail startWord={startWord} endWord={endWord} />

            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onConfirm={() => {
                    setIsOpen(false);
                    onGiveUp();
                }}
                variant="danger"
                title="Vuoi arrenderti?"
                description="Se ti arrendi, perderai la partita e il Giocatore 1 vincerà."
                confirmLabel="Sì, mi arrendo"
                cancelLabel="Continua a giocare"
            />
        </div>
    );
};

export default PlayingGameScreen;
