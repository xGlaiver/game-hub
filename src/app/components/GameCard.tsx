import Link from "next/link";
import type { CSSProperties } from "react";
import type { Game, GameAccent } from "$/games/registry";

/**
 * Il molding e mappato sull'accent del registry, NON sulla posizione nella
 * griglia: riordinare la lista non deve cambiare l'identita di un gioco.
 */
const MOLDING: Record<GameAccent, string> = {
    lime: "var(--color-mold-lime)",
    magenta: "var(--color-mold-magenta)",
    ciano: "var(--color-mold-ciano)",
    ambra: "var(--color-mold-ambra)",
};

type Props = {
    game: Game;
    /** In evidenza: occupa due colonne da lg in su. */
    featured?: boolean;
};

export default function GameCard({ game, featured = false }: Props) {
    return (
        <li
            className={`card-cabinato pannello group relative flex flex-col overflow-hidden ${
                featured ? "lg:col-span-2" : ""
            }`}
            style={{ "--molding": MOLDING[game.accent] } as CSSProperties}
        >
            {/* 1. MARQUEE — fascia serigrafata piena. Titolo in Barlow, mai Bungee. */}
            <div className="border-b-2 border-edge bg-(--molding) px-4 py-3">
                <h3 className="font-testo text-titolo uppercase text-ink-dark">
                    {game.name}
                </h3>
            </div>

            {/* 2. ZONA SCHERMO — incasso */}
            <div className="flex-1 bg-slot p-4 shadow-[inset_0_3px_0_rgb(0_0_0/0.7)]">
                <p className="font-decal text-decal uppercase text-ink-muted">
                    {game.tagline}
                </p>
                <p className="mt-2 text-body-sm text-ink-muted">
                    {game.description}
                </p>
            </div>

            {/* 3. PLANCIA — metadati dal registry + azione */}
            <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t-2 border-edge bg-plancia px-4 py-3">
                <p className="font-decal text-decal uppercase text-ink-muted">
                    {game.players} · {game.duration} · {game.difficulty}
                </p>
                <span className="cap" aria-hidden>
                    Inserisci gettone
                </span>
            </div>

            {/* Un solo target cliccabile: niente link annidati */}
            <Link
                href={`/${game.slug}`}
                className="absolute inset-0 rounded-pannello focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-accent"
            >
                <span className="sr-only">{`Gioca a ${game.name}`}</span>
            </Link>
        </li>
    );
}

/** Sagoma inerte: la sala e semivuota per scelta, non per poverta. */
export function EmptySlot() {
    return (
        <li
            aria-hidden
            className="flex min-h-56 flex-col items-center justify-center gap-2 rounded-pannello border-2 border-dashed border-edge bg-sala p-4 text-center opacity-45"
        >
            <span className="font-decal text-decal uppercase text-ink-muted">
                Slot libero
            </span>
            <span className="text-body-sm text-ink-muted">
                Qui arrivera il prossimo gioco
            </span>
        </li>
    );
}
