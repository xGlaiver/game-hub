import GameCard, { EmptySlot } from "./components/GameCard";
import { games, playableGames } from "$/games/registry";

const MIN_SLOTS = 3;

export default function Home() {
    // Con pochi giochi la prima card occupa due colonne. E una classe
    // condizionale, non una struttura diversa: da 3 giochi in su sparisce.
    const inEvidenza = playableGames.length <= 2;
    const slotLiberi = Math.max(0, MIN_SLOTS - games.length);

    return (
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
            <p className="font-decal text-decal uppercase text-accent">
                Due giocatori · un solo schermo
            </p>
            <h1 className="insegna-3d mt-3 font-insegna uppercase text-ink">
                <span className="block text-insegna">Game</span>
                <span className="block text-insegna-2 text-accent">Hub</span>
            </h1>
            <p className="mt-5 max-w-prose text-body text-ink-muted">
                Giochi da fare in due, seduti davanti allo stesso schermo.
                Niente account, niente attesa: scegli un mobile e infila il
                gettone.
            </p>

            <h2 className="mt-12 font-decal text-decal uppercase text-ink-muted">
                La sala
            </h2>
            <ul className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                {games.map((game, i) =>
                    game.status === "disponibile" ? (
                        <GameCard
                            key={game.slug}
                            game={game}
                            featured={inEvidenza && i === 0}
                        />
                    ) : (
                        <EmptySlot key={game.slug} />
                    ),
                )}
                {Array.from({ length: slotLiberi }, (_, i) => (
                    <EmptySlot key={`slot-${i}`} />
                ))}
            </ul>

            <div
                aria-hidden
                className="mt-10 h-16 bg-gradient-to-b from-transparent to-black/45"
            />
        </div>
    );
}
