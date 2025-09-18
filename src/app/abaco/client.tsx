"use client";
import { normalize_string } from "utils/string_manipulation";
import { useState } from "react";
import { capitalizeFirstLetter } from "utils/string_manipulation";

enum GameStatus {
    Start = "start",
    Won = "won",
    Playing = "playing",
}

const DEFAULT_START_WORD = "Abaco";
const DEFAULT_END_WORD = "Zuzzurellone";

export default function AbacoPageClient() {
    const [wordToGuess, setWordToGuess] = useState<string>("");
    const [currentGuess, setCurrentGuess] = useState<string>("");
    const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.Start);
    const [numberAttempts, setNumberAttempts] = useState<number>(0);
    const [startWord, setStartWord] = useState<string>(DEFAULT_START_WORD);
    const [endWord, setEndWord] = useState<string>(DEFAULT_END_WORD);
    const [errorMessage, setErrorMessage] = useState<string>("");

    function reset() {
        setWordToGuess("");
        setCurrentGuess("");
        setNumberAttempts(0);
        setStartWord("Abaco");
        setEndWord("Zuzzurellone");
        setGameStatus(GameStatus.Start);
    }

    function enterWordToGuess() {
        const wordToGuessNormalized = normalize_string(wordToGuess);

        setErrorMessage("");
        if (wordToGuessNormalized === "") return;
        if (wordToGuessNormalized.includes(" ")) {
            setErrorMessage("La parola non può contenere spazi");
            return;
        }
        setGameStatus(GameStatus.Playing);
    }

    function tryToGuessWord() {
        const wordToGuessNormalized = normalize_string(wordToGuess);
        const currentGuessNormalized = normalize_string(currentGuess);
        const startWordNormalized = normalize_string(startWord);
        const endWordNormalized = normalize_string(endWord);

        if (currentGuessNormalized === "") return;
        setErrorMessage("");
        if (currentGuessNormalized.includes(" ")) {
            setErrorMessage("La parola non può contenere spazi");
            return;
        }
        if (
            currentGuessNormalized <= startWordNormalized ||
            currentGuessNormalized >= endWordNormalized
        ) {
            setErrorMessage("La parola inserita è fuori dal range");
            return;
        }

        setNumberAttempts((prev) => prev + 1);
        if (currentGuessNormalized === wordToGuessNormalized) {
            setGameStatus(GameStatus.Won);
            return;
        }

        if (currentGuessNormalized < wordToGuessNormalized) {
            setStartWord(capitalizeFirstLetter(currentGuessNormalized));
        } else if (currentGuessNormalized > wordToGuessNormalized) {
            setEndWord(capitalizeFirstLetter(currentGuessNormalized));
        }

        setCurrentGuess("");
    }

    return (
        <div>
            {gameStatus === GameStatus.Start && (
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
                        />
                        <button
                            className="border border-gray-300 rounded-md p-2 text-black bg-amber-50 cursor-pointer hover:bg-amber-200 transition"
                            onClick={enterWordToGuess}
                        >
                            Conferma
                        </button>
                    </div>
                </div>
            )}

            {gameStatus === GameStatus.Playing && (
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
                                setCurrentGuess(
                                    normalize_string(e.target.value)
                                )
                            }
                        />
                        <button
                            className="border border-gray-300 rounded-md p-2 text-black bg-amber-50 cursor-pointer hover:bg-amber-200 transition"
                            onClick={tryToGuessWord}
                        >
                            Conferma
                        </button>
                    </div>
                    <p className="mt-4">
                        Numero di tentativi: {numberAttempts}
                    </p>
                </div>
            )}
            <p
                className={`text-red-800 font-medium transition mt-2.5 ${
                    errorMessage
                        ? "opacity-100 translate-0"
                        : "opacity-0 -translate-x-60"
                }`}
            >
                {errorMessage}
            </p>
            {gameStatus === GameStatus.Won && (
                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-semibold">
                        Complimenti! Hai indovinato la parola!
                    </h2>
                    <p>
                        La parola era:{" "}
                        <span className="font-medium">{wordToGuess}</span>
                    </p>
                    <p>
                        Numero di tentativi:{" "}
                        <span className="font-medium">{numberAttempts}</span>
                    </p>
                    <button
                        className="border border-gray-300 rounded-md p-2 text-black bg-amber-50 cursor-pointer hover:bg-amber-200 transition mt-4"
                        onClick={reset}
                    >
                        Gioca di nuovo
                    </button>
                </div>
            )}
        </div>
    );
}
