import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";

/**
 * `primary` per un'azione che vuoi incoraggiare, `danger` per una che vuoi
 * far pensare due volte (cancellare, arrendersi).
 *
 * In entrambe le varianti il cappuccio giallo sta sull'azione che si vuole
 * suggerire: confermare se e primary, tornare indietro se e danger. Il giallo
 * e la risorsa scarsa del sistema e vuol dire sempre "la prossima cosa da
 * toccare".
 */
export type ModalVariant = "primary" | "danger";

type Props = {
    isOpen: boolean;
    /** Chiude senza fare niente: Annulla, click sullo sfondo, tasto Escape. */
    onClose: () => void;
    /** Non chiude il modale: decide chi lo usa. */
    onConfirm: () => void;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: ModalVariant;
};

const FOCUSABLE =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

const Modal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmLabel = "Conferma",
    cancelLabel = "Annulla",
    variant = "primary",
}: Props) => {
    const dialogRef = useRef<HTMLDivElement>(null);
    const cancelRef = useRef<HTMLButtonElement>(null);
    const titleId = useId();
    const descriptionId = useId();

    // All'apertura porta il focus sul bottone piu innocuo; alla chiusura lo
    // restituisce a chi ce l'aveva prima.
    useEffect(() => {
        if (!isOpen) return;

        const previouslyFocused = document.activeElement as HTMLElement | null;
        cancelRef.current?.focus();

        return () => previouslyFocused?.focus();
    }, [isOpen]);

    // Escape chiude; Tab gira in tondo dentro al dialogo invece di uscirne.
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
                return;
            }
            if (event.key !== "Tab") return;

            const focusables =
                dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
            if (!focusables?.length) return;

            const first = focusables[0];
            const last = focusables[focusables.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const isDanger = variant === "danger";

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* La sala si spegne, non si sfoca: nessun blur, nessun vetro. */}
            <div
                data-testid="modal-backdrop"
                aria-hidden="true"
                className="absolute inset-0 bg-[#05060e]/85"
                onClick={onClose}
            />

            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={descriptionId}
                className="pannello animate-slam relative z-10 w-full max-w-[30rem] overflow-hidden motion-reduce:animate-none"
            >
                {/* Fascia che dichiara la variante prima ancora del titolo.
                    La zebra serve perche giallo e corallo collassano in
                    deuteranopia: il pericolo non puo essere solo colore. */}
                <div
                    aria-hidden
                    className={
                        isDanger
                            ? "h-1.5 bg-[repeating-linear-gradient(45deg,var(--color-accent)_0_10px,var(--color-ink-dark)_10px_20px)]"
                            : "h-1.5 bg-accent"
                    }
                />

                <div className="p-6">
                    <h2
                        id={titleId}
                        className="font-testo text-titolo uppercase text-ink"
                    >
                        {title}
                    </h2>
                    <p
                        id={descriptionId}
                        className="mt-2 text-body text-ink-muted"
                    >
                        {description}
                    </p>

                    {/* DOM: prima confirm, poi cancel (il focus trap conta su
                        questo ordine). flex-row-reverse mette il distruttivo a
                        destra e lascia a sinistra, gia in focus, la via d'uscita. */}
                    <div className="mt-6 flex flex-row-reverse justify-end gap-3">
                        <button
                            className={isDanger ? "cap cap-danger" : "cap"}
                            onClick={onConfirm}
                        >
                            {confirmLabel}
                        </button>
                        <button
                            ref={cancelRef}
                            className={isDanger ? "cap" : "cap-quieto"}
                            onClick={onClose}
                        >
                            {cancelLabel}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body,
    );
};

export default Modal;
