type Props = {
    message: string;
    /**
     * Cambia a ogni errore, anche se il messaggio e identico al precedente:
     * serve come `key` per rimontare l'elemento e rigiocare l'animazione.
     * Arriva da client.tsx, non dal reducer.
     */
    nonce: number;
    id?: string;
};

/**
 * L'errore viene schiaffato li come un adesivo, non scivola da mezzo schermo.
 * `role="status"` + `aria-live` perche prima era completamente muto per gli
 * screen reader: l'unico segnale era il colore.
 */
const ErrorMessage = ({ message, nonce, id }: Props) => {
    if (!message) {
        return <p id={id} role="status" aria-live="polite" className="sr-only" />;
    }

    return (
        <p
            id={id}
            key={nonce}
            role="status"
            aria-live="polite"
            className="animate-decal mt-3 flex items-start gap-2 rounded-targa border-l-3 border-danger bg-slot px-3 py-2 text-body-sm font-medium text-danger motion-reduce:animate-none"
        >
            <span aria-hidden className="font-decal">
                !
            </span>
            {message}
        </p>
    );
};

export default ErrorMessage;
