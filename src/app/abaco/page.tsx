import Link from "next/link";
import AbacoPageClient from "./client";
import { getGame } from "$/games/registry";

const game = getGame("abaco");

export default function AbacoPage() {
    return (
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
            <Link
                href="/"
                className="cap-quieto inline-flex focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-accent"
            >
                ← Sala
            </Link>

            {/* Lockup su due righe: "Zuzzurellone" a 12 glifi in Bungee non
                sta su una riga sola a nessuna larghezza utile. */}
            <h1 className="insegna-3d mt-6 font-insegna uppercase text-ink">
                <span className="block text-insegna">Abaco</span>
                <span className="block text-insegna-2 text-accent">
                    Zuzzurellone
                </span>
            </h1>

            <p className="mt-4 max-w-prose text-body text-ink-muted">
                {game?.description}
            </p>

            <div className="mt-8">
                <AbacoPageClient />
            </div>
        </div>
    );
}
