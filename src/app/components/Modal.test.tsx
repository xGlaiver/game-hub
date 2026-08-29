import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { ComponentProps } from "react";
import Modal from "./Modal";

type ModalProps = ComponentProps<typeof Modal>;

const noop = () => {};

const baseProps: ModalProps = {
    isOpen: true,
    onClose: noop,
    onConfirm: noop,
    title: "Vuoi arrenderti?",
    description: "Perderai la partita e il Giocatore 1 vincera.",
};

const renderModal = (overrides: Partial<ModalProps> = {}) => {
    const user = userEvent.setup({ delay: null });
    render(<Modal {...baseProps} {...overrides} />);
    return user;
};

const dialog = () => screen.getByRole("dialog");
const confirm = (name = "Conferma") =>
    screen.getByRole("button", { name });
const cancel = (name = "Annulla") => screen.getByRole("button", { name });

describe("contenuto", () => {
    it("non renderizza niente quando e chiuso", () => {
        render(<Modal {...baseProps} isOpen={false} />);

        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("mostra titolo e descrizione", () => {
        renderModal();

        expect(
            screen.getByRole("heading", { name: "Vuoi arrenderti?" }),
        ).toBeInTheDocument();
        expect(
            screen.getByText("Perderai la partita e il Giocatore 1 vincera."),
        ).toBeInTheDocument();
    });

    it("usa il titolo come nome accessibile del dialogo", () => {
        renderModal();

        expect(dialog()).toHaveAccessibleName("Vuoi arrenderti?");
    });

    it("usa Conferma e Annulla come label di default", () => {
        renderModal();

        expect(confirm()).toBeInTheDocument();
        expect(cancel()).toBeInTheDocument();
    });

    it("accetta label personalizzate per i due bottoni", () => {
        renderModal({
            confirmLabel: "Si, mi arrendo",
            cancelLabel: "Continua a giocare",
        });

        expect(confirm("Si, mi arrendo")).toBeInTheDocument();
        expect(cancel("Continua a giocare")).toBeInTheDocument();
        expect(
            screen.queryByRole("button", { name: "Conferma" }),
        ).not.toBeInTheDocument();
    });
});

describe("interazione", () => {
    it("chiama onConfirm quando si conferma", async () => {
        const onConfirm = vi.fn();
        const onClose = vi.fn();
        const user = renderModal({ onConfirm, onClose });

        await user.click(confirm());

        expect(onConfirm).toHaveBeenCalledOnce();
        // il modale non si chiude da solo: decide chi lo usa
        expect(onClose).not.toHaveBeenCalled();
    });

    it("chiama onClose quando si annulla", async () => {
        const onClose = vi.fn();
        const onConfirm = vi.fn();
        const user = renderModal({ onClose, onConfirm });

        await user.click(cancel());

        expect(onClose).toHaveBeenCalledOnce();
        expect(onConfirm).not.toHaveBeenCalled();
    });

    it("chiama onClose quando si clicca lo sfondo", async () => {
        const onClose = vi.fn();
        const user = renderModal({ onClose });

        await user.click(screen.getByTestId("modal-backdrop"));

        expect(onClose).toHaveBeenCalledOnce();
    });

    it("chiama onClose quando si preme Escape", async () => {
        const onClose = vi.fn();
        const user = renderModal({ onClose });

        await user.keyboard("{Escape}");

        expect(onClose).toHaveBeenCalledOnce();
    });
});

describe("gestione del focus", () => {
    it("mette il focus sul bottone di annullamento all'apertura", () => {
        renderModal();

        expect(cancel()).toHaveFocus();
    });

    it("non lascia uscire il Tab dal dialogo", async () => {
        const user = renderModal();

        // Il focus parte da Annulla, che e l'ultimo dei due bottoni.
        expect(cancel()).toHaveFocus();

        await user.tab();
        expect(confirm()).toHaveFocus();

        await user.tab({ shift: true });
        expect(cancel()).toHaveFocus();
    });

    it("restituisce il focus a chi ce l'aveva prima dell'apertura", () => {
        const Host = ({ isOpen }: { isOpen: boolean }) => (
            <>
                <button>Mi arrendo</button>
                <Modal {...baseProps} isOpen={isOpen} />
            </>
        );

        const { rerender } = render(<Host isOpen={false} />);
        const trigger = screen.getByRole("button", { name: "Mi arrendo" });
        trigger.focus();

        rerender(<Host isOpen />);
        expect(cancel()).toHaveFocus();

        rerender(<Host isOpen={false} />);
        expect(trigger).toHaveFocus();
    });
});
