import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";

/**
 * `primary` per un'azione che vuoi incoraggiare, `danger` per una che vuoi
 * far pensare due volte (cancellare, arrendersi).
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

const CONFIRM_STYLES: Record<ModalVariant, string> = {
    primary: "bg-emerald-600 hover:bg-emerald-500 border-emerald-700",
    danger: "bg-red-700 hover:bg-red-600 border-red-800",
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

    return createPortal(
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div
                data-testid="modal-backdrop"
                aria-hidden="true"
                className="absolute inset-0 bg-black opacity-50"
                onClick={onClose}
            />
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={descriptionId}
                className="relative z-10 bg-white text-black p-6 rounded-lg max-w-md shadow-xl"
            >
                <h2 id={titleId} className="text-2xl font-semibold">
                    {title}
                </h2>
                <p id={descriptionId} className="mt-2">
                    {description}
                </p>
                <div className="flex gap-2 mt-6">
                    <button
                        className={`border rounded-md p-2 text-white cursor-pointer transition ${CONFIRM_STYLES[variant]}`}
                        onClick={onConfirm}
                    >
                        {confirmLabel}
                    </button>
                    <button
                        ref={cancelRef}
                        className="border border-gray-300 rounded-md p-2 text-black bg-amber-50 cursor-pointer hover:bg-amber-200 transition"
                        onClick={onClose}
                    >
                        {cancelLabel}
                    </button>
                </div>
            </div>
        </div>,
        document.body,
    );
};

export default Modal;
