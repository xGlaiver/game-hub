type Props = {
    value: number;
};

/**
 * Il contatore del cabinato. Usato identico nelle tre schermate (gioco,
 * vittoria, sconfitta), cosi il numero non cambia posto ne aspetto quando
 * la partita finisce.
 *
 * `key={value}` rimonta l'elemento a ogni tentativo e fa rigiocare
 * l'animazione del rullo: CSS puro, nessun timer.
 */
const AttemptCounter = ({ value }: Props) => (
    <div className="targa flex items-center gap-3">
        <span className="font-decal text-decal uppercase text-ink-muted">
            Tentativi
        </span>
        <output
            key={value}
            role="status"
            aria-label="Tentativi"
            className="animate-reel grid h-11 min-w-11 place-items-center rounded-slot border-2 border-edge bg-slot px-2 font-decal text-hud tabular-nums text-accent motion-reduce:animate-none"
        >
            {value}
        </output>
    </div>
);

export default AttemptCounter;
