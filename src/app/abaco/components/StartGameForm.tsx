import { normalize_string } from "utils/string_manipulation";

type Props = {
    wordToGuess: string;
    setWordToGuess: (word: string) => void;
    onEnter: () => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

const StartGameForm = ({
    wordToGuess,
    setWordToGuess,
    onEnter,
    onKeyDown,
}: Props) => {
    return (
        <div>
            <h4>Giocatore 1, inseririsci la parola da indovinare:</h4>
            <div className="flex gap-2 mt-4">
                <input
                    className="border border-gray-300 rounded-md p-2 text-black bg-amber-50"
                    type="text"
                    value={wordToGuess}
                    onChange={(e) =>
                        setWordToGuess(normalize_string(e.target.value))
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
        </div>
    );
};

export default StartGameForm;
