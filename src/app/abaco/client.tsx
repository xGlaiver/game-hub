"use client";
import { useState } from "react";
import { capitalizeFirstLetter } from "utils/capitalize";

enum GameStatus {
    Start = "start",
    Won = "won",
    Playing = "playing",
}

export default function AbacoPageClient() {
    const [wordToGuess, setWordToGuess] = useState<string>("");
    const [currentGuess, setCurrentGuess] = useState<string>("");
    const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.Start);
    const [numberAttempts, setNumberAttempts] = useState<number>(0);
    const [startWord, setStartWord] = useState<string>("Abaco");
    const [endWord, setEndWord] = useState<string>("Zuzzurellone");
    const [showError, setShowError] = useState<boolean>(false);
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
        if (wordToGuess.trim() === "") return;
        setGameStatus(GameStatus.Playing);
    }

    function tryToGuessWord() {
        if (currentGuess.trim() === "") return;
        setShowError(false);

        if (
            currentGuess.toLocaleLowerCase() <= startWord.toLowerCase() ||
            currentGuess.toLocaleLowerCase() >= endWord.toLowerCase()
        ) {
            setShowError(true);
            setErrorMessage("La parola inserita è fuori dal range");
            return;
        }

        setNumberAttempts(numberAttempts + 1);
        if (
            currentGuess.toLowerCase().trim() ===
            wordToGuess.toLowerCase().trim()
        ) {
            setGameStatus(GameStatus.Won);
            return;
        }

        if (currentGuess.toLowerCase() < wordToGuess.toLowerCase()) {
            setStartWord(capitalizeFirstLetter(currentGuess));
        } else if (currentGuess.toLowerCase() > wordToGuess.toLowerCase()) {
            setEndWord(capitalizeFirstLetter(currentGuess));
        }

        setCurrentGuess("");
    }

    return (
        <>
            {gameStatus === GameStatus.Start && (
                <div>
                    <h4>Giocatore 1, inseririsci la parola da indovinare:</h4>
                    <div className="flex gap-2 mt-4">
                        <input
                            className="border border-gray-300 rounded-md p-2 text-black bg-amber-50"
                            type="text"
                            value={wordToGuess}
                            onChange={(e) => setWordToGuess(e.target.value)}
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
                            onChange={(e) => setCurrentGuess(e.target.value)}
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
                    <p
                        className={`text-red-800 font-medium ${
                            showError ? "opacity-100" : "opacity-0"
                        }`}
                    >
                        {errorMessage}
                    </p>
                </div>
            )}

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
        </>
    );
}
