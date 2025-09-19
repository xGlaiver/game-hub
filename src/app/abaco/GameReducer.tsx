import {
    capitalizeFirstLetter,
    normalize_string,
} from "utils/string_manipulation";

export enum GameStatus {
    Start = "start",
    Won = "won",
    Playing = "playing",
}

const DEFAULT_START_WORD = "Abaco";
const DEFAULT_END_WORD = "Zuzzurellone";

type InitialState = {
    wordToGuess: string;
    currentGuess: string;
    gameStatus: GameStatus;
    numberAttempts: number;
    startWord: string;
    endWord: string;
    errorMessage: string;
};

export const initialState = {
    wordToGuess: "",
    currentGuess: "",
    gameStatus: GameStatus.Start,
    numberAttempts: 0,
    startWord: DEFAULT_START_WORD,
    endWord: DEFAULT_END_WORD,
    errorMessage: "",
} satisfies InitialState;

type ActionGame =
    | { type: "set_word_to_guess"; payload: string }
    | { type: "set_current_guess"; payload: string }
    | { type: "enter_word_to_guess" }
    | { type: "try_to_guess_word" }
    | { type: "reset" };

export function gameReducer(state: InitialState, action: ActionGame) {
    const { currentGuess, wordToGuess, startWord, endWord } = state;
    const wordToGuessNormalized = normalize_string(wordToGuess);
    const currentGuessNormalized = normalize_string(currentGuess);
    const startWordNormalized = normalize_string(startWord);
    const endWordNormalized = normalize_string(endWord);

    const lowerCaseAlphaPattern = /^[a-z]*$/;

    switch (action.type) {
        case "set_word_to_guess":
            if (!lowerCaseAlphaPattern.test(action.payload)) return state;

            return {
                ...state,
                wordToGuess: action.payload,
            };
        case "set_current_guess":
            if (!lowerCaseAlphaPattern.test(action.payload)) return state;
            return {
                ...state,
                currentGuess: action.payload,
            };
        case "enter_word_to_guess":
            if (wordToGuessNormalized === "") {
                return {
                    ...state,
                    errorMessage: "La parola non può essere vuota",
                };
            }
            return {
                ...state,
                errorMessage: "",
                gameStatus: GameStatus.Playing,
            };
        case "try_to_guess_word":
            if (currentGuessNormalized === "") {
                return {
                    ...state,
                    errorMessage: "La parola non può essere vuota",
                };
            }

            if (
                currentGuessNormalized <= startWordNormalized ||
                currentGuessNormalized >= endWordNormalized
            ) {
                return {
                    ...state,
                    errorMessage: "La parola inserita è fuori dal range",
                };
            }

            let newStartWord = startWord;
            let newEndWord = endWord;
            let newGameStatus = GameStatus.Playing;

            if (currentGuessNormalized === wordToGuessNormalized) {
                newGameStatus = GameStatus.Won;
            } else if (currentGuessNormalized < wordToGuessNormalized) {
                newStartWord = capitalizeFirstLetter(currentGuessNormalized);
            } else if (currentGuessNormalized > wordToGuessNormalized) {
                newEndWord = capitalizeFirstLetter(currentGuessNormalized);
            }

            return {
                ...state,
                numberAttempts: state.numberAttempts + 1,
                startWord: newStartWord,
                endWord: newEndWord,
                gameStatus: newGameStatus,
                errorMessage: "",
                currentGuess: "",
            };
        case "reset":
            return initialState;
        default:
            return state;
    }
}
