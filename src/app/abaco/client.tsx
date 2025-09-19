"use client";
import { KeyboardEvent, useReducer } from "react";
import StartGameForm from "./components/StartGameForm";
import PlayingGameScreen from "./components/PlayingGameScreen";
import WonScreen from "./components/WonScreen";
import ErrorMessage from "./components/ErrorMessage";
import { gameReducer, GameStatus, initialState } from "./GameReducer";

const AbacoPageClient = () => {
    const [stateGame, dispatchGame] = useReducer(gameReducer, initialState);

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
                    onEnter={() =>
                        dispatchGame({ type: "enter_word_to_guess" })
                    }
                    onKeyDown={handleEnterKey}
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
                />
            )}
            {stateGame.gameStatus === GameStatus.Won && (
                <WonScreen
                    wordToGuess={stateGame.wordToGuess}
                    numberAttempts={stateGame.numberAttempts}
                    onReset={() => dispatchGame({ type: "reset" })}
                />
            )}

            <ErrorMessage message={stateGame.errorMessage} />
        </div>
    );
};

export default AbacoPageClient;
