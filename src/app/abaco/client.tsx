"use client";
import { KeyboardEvent, useId, useReducer, useState } from "react";
import StartGameForm from "./components/StartGameForm";
import PlayingGameScreen from "./components/PlayingGameScreen";
import WonScreen from "./components/WonScreen";
import LostScreen from "./components/LostScreen";
import ErrorMessage from "./components/ErrorMessage";
import { gameReducer, GameStatus, initialState } from "./GameReducer";

const AbacoPageClient = () => {
    const [stateGame, dispatchGame] = useReducer(gameReducer, initialState);
    const errorId = useId();

    // Contatore per rigiocare l'animazione dell'errore anche quando il
    // messaggio e identico al precedente. Vive qui e non nel reducer: e una
    // faccenda di presentazione, non una regola del gioco.
    // Si aggiorna durante il render confrontando l'identita dell'oggetto di
    // stato — i rami d'errore del reducer ne restituiscono sempre uno nuovo.
    const [errorTick, setErrorTick] = useState({ last: stateGame, nonce: 0 });
    if (errorTick.last !== stateGame) {
        setErrorTick({
            last: stateGame,
            nonce: stateGame.errorMessage
                ? errorTick.nonce + 1
                : errorTick.nonce,
        });
    }

    const hasError = Boolean(stateGame.errorMessage);

    const handleEnterKey = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            if (stateGame.gameStatus === GameStatus.Start) {
                dispatchGame({ type: "enter_word_to_guess" });
            } else if (stateGame.gameStatus === GameStatus.Playing) {
                dispatchGame({ type: "try_to_guess_word" });
            }
        }
    };

    return (
        <div>
            {stateGame.gameStatus === GameStatus.Start && (
                <StartGameForm
                    wordToGuess={stateGame.wordToGuess}
                    setWordToGuess={(word) =>
                        dispatchGame({
                            type: "set_word_to_guess",
                            payload: word,
                        })
                    }
                    onEnter={() => dispatchGame({ type: "enter_word_to_guess" })}
                    onKeyDown={handleEnterKey}
                    errorId={errorId}
                    hasError={hasError}
                />
            )}

            {stateGame.gameStatus === GameStatus.Playing && (
                <PlayingGameScreen
                    currentGuess={stateGame.currentGuess}
                    setCurrentGuess={(word) =>
                        dispatchGame({
                            type: "set_current_guess",
                            payload: word,
                        })
                    }
                    startWord={stateGame.startWord}
                    endWord={stateGame.endWord}
                    numberAttempts={stateGame.numberAttempts}
                    onEnter={() => dispatchGame({ type: "try_to_guess_word" })}
                    onKeyDown={handleEnterKey}
                    onGiveUp={() => dispatchGame({ type: "give_up" })}
                    errorId={errorId}
                    hasError={hasError}
                />
            )}

            {stateGame.gameStatus === GameStatus.Won && (
                <WonScreen
                    wordToGuess={stateGame.wordToGuess}
                    numberAttempts={stateGame.numberAttempts}
                    onReset={() => dispatchGame({ type: "reset" })}
                />
            )}

            {stateGame.gameStatus === GameStatus.Lost && (
                <LostScreen
                    wordToGuess={stateGame.wordToGuess}
                    numberAttempts={stateGame.numberAttempts}
                    onReset={() => dispatchGame({ type: "reset" })}
                />
            )}

            <ErrorMessage
                id={errorId}
                message={stateGame.errorMessage}
                nonce={errorTick.nonce}
            />
        </div>
    );
};

export default AbacoPageClient;
