type Props = {
    wordToGuess: string;
    numberAttempts: number;
    onReset: () => void;
};

const WonScreen = ({ wordToGuess, numberAttempts, onReset }: Props) => (
    <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold">
            Complimenti! Hai indovinato la parola! 🥳
        </h2>
        <p>
            La parola era: <span className="font-medium">{wordToGuess}</span>
        </p>
        <p>
            Numero di tentativi:{" "}
            <span className="font-medium">{numberAttempts}</span>
        </p>
        <button
            className="border border-gray-300 rounded-md p-2 text-black bg-amber-50 cursor-pointer hover:bg-amber-200 transition mt-4"
            onClick={onReset}
        >
            Gioca di nuovo
        </button>
    </div>
);

export default WonScreen;
