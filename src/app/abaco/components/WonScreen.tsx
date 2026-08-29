import AttemptCounter from "./AttemptCounter";

type Props = {
    wordToGuess: string;
    numberAttempts: number;
    onReset: () => void;
};

const WonScreen = ({ wordToGuess, numberAttempts, onReset }: Props) => (
    <div className="pannello overflow-hidden">
        {/* Le lampadine scorrono solo qui: e l'unico momento in cui la sala
            festeggia. Ferme nell'header. */}
        <div
            aria-hidden
            className="rail-lampadine animate-marquee h-2 motion-reduce:animate-none"
        />

        <div className="p-5 sm:p-6">
            <p className="font-decal text-decal uppercase text-success">
                Round vinto
            </p>
            <h2 className="mt-2 font-testo text-titolo uppercase text-ink">
                Complimenti, hai indovinato!
            </h2>

            <div className="mt-5 flex flex-wrap items-center gap-4">
                <div className="targa">
                    <p className="font-decal text-decal uppercase text-ink-muted">
                        La parola era
                    </p>
                    <p className="mt-1 font-decal text-punteggio uppercase text-success">
                        {wordToGuess}
                    </p>
                </div>
                <AttemptCounter value={numberAttempts} />
            </div>

            <button className="cap cap-success mt-6" onClick={onReset}>
                Gioca di nuovo
            </button>
        </div>
    </div>
);

export default WonScreen;
