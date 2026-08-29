import AttemptCounter from "./AttemptCounter";

type Props = {
    wordToGuess: string;
    numberAttempts: number;
    onReset: () => void;
};

const LostScreen = ({ wordToGuess, numberAttempts, onReset }: Props) => (
    <div className="pannello overflow-hidden">
        {/* Zebra: la sconfitta non e affidata al solo colore. */}
        <div
            aria-hidden
            className="h-2 bg-[repeating-linear-gradient(45deg,var(--color-danger)_0_10px,var(--color-ink-dark)_10px_20px)]"
        />

        <div className="p-5 sm:p-6">
            <p className="font-decal text-decal uppercase text-danger">Tilt</p>
            <h2 className="mt-2 font-testo text-titolo uppercase text-ink">
                Ti sei arreso, hai perso il round
            </h2>

            <div className="mt-5 flex flex-wrap items-center gap-4">
                <div className="targa">
                    <p className="font-decal text-decal uppercase text-ink-muted">
                        La parola era
                    </p>
                    <p className="mt-1 font-decal text-punteggio uppercase text-danger">
                        {wordToGuess}
                    </p>
                </div>
                <AttemptCounter value={numberAttempts} />
            </div>

            <button className="cap mt-6" onClick={onReset}>
                Gioca di nuovo
            </button>
        </div>
    </div>
);

export default LostScreen;
