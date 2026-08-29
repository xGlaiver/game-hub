import { normalize_string } from "$/utils/string_manipulation";
import Modal from "$/app/components/Modal";
import { useState } from "react";

type Props = {
    currentGuess: string;
    startWord: string;
    endWord: string;
    numberAttempts: number;
    setCurrentGuess: (word: string) => void;
    onEnter: () => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onGiveUp: () => void;
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
}: Props) => {

    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <h4>Giocatore 2, indovina la parola:</h4>

            <p className="text-2xl font-medium mt-3">
                {startWord} - {endWord}
            </p>
            <div className="flex gap-2 mt-4">
                <input
                    className="border border-gray-300 rounded-md p-2 text-black bg-amber-50"
                    type="text"
                    value={currentGuess}
                    onChange={(e) =>
                        setCurrentGuess(normalize_string(e.target.value))
                    }
                    onKeyDown={onKeyDown}
                />
                <button
                    className="border border-gray-300 rounded-md p-2 text-black bg-amber-50 cursor-pointer hover:bg-amber-200 transition"
                    onClick={onEnter}
                >
                    Conferma
                </button>
            </div>
            <p className="mt-4">Numero di tentativi: {numberAttempts}</p>
            <button
                className="border border-gray-300 rounded-md p-2 text-black bg-amber-50 cursor-pointer hover:bg-amber-200 transition mt-4"
                onClick={() => setIsOpen(true)}
            >
                Mi arrendo
            </button>
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
