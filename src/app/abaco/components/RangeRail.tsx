import { useState } from "react";
import { ALPHABET, analyzeRange } from "$/utils/range_geometry";

type Props = {
    startWord: string;
    endWord: string;
};

const percent = (pos: number) => `${(pos / ALPHABET.length) * 100}%`;

/**
 * La saracinesca: mostra quanto alfabeto e ancora in gioco.
 *
 * Le lettere su cui i due estremi ormai coincidono diventano tessere gialle
 * (certe, fuori dal gioco) e la striscia si ri-scala sulla prima posizione
 * ancora aperta. Ogni tentativo lascia una tacca fantasma sul binario: la
 * scia della partita. Quando un tentativo sposta le paratie di pochissimo la
 * tacca lo dice comunque, invece di fingere un movimento che non c'e stato.
 *
 * Tutto lo stato visivo vive qui: il reducer non sa niente di questo.
 */
const RangeRail = ({ startWord, endWord }: Props) => {
    const { depth, fromPos, toPos } = analyzeRange(startWord, endWord);

    const [ghosts, setGhosts] = useState<number[]>([]);
    const [seen, setSeen] = useState({ fromPos, toPos, depth });

    // Stato derivato da un cambio di prop: si aggiorna DURANTE il render, non
    // in un effetto. React se ne accorge e ri-renderizza subito, senza mai
    // mostrare il frame intermedio e senza il render a cascata di useEffect.
    if (
        seen.fromPos !== fromPos ||
        seen.toPos !== toPos ||
        seen.depth !== depth
    ) {
        setSeen({ fromPos, toPos, depth });

        if (seen.depth !== depth) {
            // Cambiata la profondita, la striscia cambia scala: le vecchie
            // tacche parlavano di un'altra posizione e non valgono piu.
            setGhosts([]);
        } else {
            const marks: number[] = [];
            if (seen.fromPos !== fromPos) marks.push(seen.fromPos);
            if (seen.toPos !== toPos) marks.push(seen.toPos);
            setGhosts((current) => [...current, ...marks]);
        }
    }

    // Le parole si mostrano come le tiene il reducer (maiuscola iniziale),
    // tagliate sulla profondita: il prefisso ormai certo si smorza.
    const lockedLetters = [...startWord.slice(0, depth)];
    const openStart = startWord.slice(depth);
    const openEnd = endWord.slice(depth);

    const firstOpen = Math.floor(fromPos);
    const lastOpen = Math.ceil(toPos);

    return (
        <section aria-label="Intervallo di ricerca" className="pannello p-4">
            {/* Tessere bloccate: le lettere ormai certe */}
            <div className="flex flex-wrap items-center gap-2">
                <span className="font-decal text-decal uppercase text-ink-muted">
                    Bloccate
                </span>
                <ol
                    className="flex gap-1"
                    aria-label={
                        lockedLetters.length > 0
                            ? `Lettere certe: ${lockedLetters.join(" ").toUpperCase()}`
                            : "Nessuna lettera certa"
                    }
                >
                    {lockedLetters.map((letter, i) => (
                        <li
                            key={`${letter}-${i}`}
                            className="animate-lock grid h-8 w-7 place-items-center rounded-targa bg-accent font-decal text-hud uppercase text-ink-dark motion-reduce:animate-none"
                            style={{ animationDelay: `${i * 40}ms` }}
                        >
                            {letter}
                        </li>
                    ))}
                    {lockedLetters.length === 0 && (
                        <li className="font-decal text-decal uppercase text-ink-muted">
                            nessuna
                        </li>
                    )}
                </ol>
            </div>

            {/* Il binario */}
            <div className="relative mt-4 h-10 rounded-slot border-2 border-edge bg-slot shadow-[inset_0_2px_0_rgb(0_0_0/0.75)]">
                {/* La scia dei tentativi */}
                {ghosts.map((pos, i) => (
                    <i
                        key={i}
                        aria-hidden
                        className="absolute top-0 h-full w-px bg-edge opacity-60"
                        style={{ left: percent(pos) }}
                    />
                ))}

                {/* Segmento vivo: il territorio ancora tuo */}
                <div
                    aria-hidden
                    className="absolute inset-y-1 min-w-[10px] rounded-targa border-y-2 border-accent bg-accent/25 transition-[left,right] duration-[420ms] ease-serranda motion-reduce:transition-none"
                    style={{
                        left: percent(fromPos),
                        right: `${100 - (toPos / ALPHABET.length) * 100}%`,
                    }}
                />

                {/* Le paratie: gli unici cerchi di tutto il sito */}
                <span
                    aria-hidden
                    className="rail-paratia"
                    style={{ left: percent(fromPos) }}
                />
                <span
                    aria-hidden
                    className="rail-paratia"
                    style={{ left: percent(toPos) }}
                />
            </div>

            {/* Striscia a-z */}
            <ol
                aria-hidden
                className="mt-1 grid font-decal text-[0.625rem] tracking-normal"
                style={{ gridTemplateColumns: "repeat(26, minmax(0,1fr))" }}
            >
                {ALPHABET.map((letter, i) => (
                    <li
                        key={letter}
                        className={
                            i >= firstOpen && i <= lastOpen
                                ? "text-center text-ink"
                                : "text-center text-edge"
                        }
                    >
                        {letter}
                    </li>
                ))}
            </ol>

            {/* Le parole restano: il binario e il colpo d'occhio, questo e il dato */}
            <div className="mt-3 flex items-baseline justify-between gap-4">
                <p className="font-decal text-hud text-info">
                    <span className="text-ink-muted">
                        {startWord.slice(0, depth)}
                    </span>
                    {openStart}
                </p>
                <p className="text-right font-decal text-hud text-danger">
                    <span className="text-ink-muted">
                        {endWord.slice(0, depth)}
                    </span>
                    {openEnd}
                </p>
            </div>
        </section>
    );
};

export default RangeRail;
