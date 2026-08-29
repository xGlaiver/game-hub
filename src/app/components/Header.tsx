import Link from "next/link";
import { playableGames } from "$/games/registry";

export default function Header() {
    return (
        <header className="border-b-2 border-edge bg-plancia">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
                <Link
                    href="/"
                    className="rounded-targa focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-accent"
                >
                    <span className="insegna-3d font-insegna text-[1.375rem] uppercase text-ink">
                        Game Hub
                    </span>
                </Link>
                <p className="font-decal text-decal uppercase text-ink-muted">
                    {playableGames.length.toString().padStart(2, "0")} giochi
                </p>
            </div>
            <div aria-hidden className="h-0.5 bg-accent" />
            <div aria-hidden className="rail-lampadine h-1.5 opacity-25" />
        </header>
    );
}
