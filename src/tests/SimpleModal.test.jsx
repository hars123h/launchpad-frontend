import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SimpleModal from "../components/SimpleModal";

describe("SimpleModal Component", () => {
    it("does not render when isOpen is false", () => {
        render(
            <SimpleModal isOpen={false} onClose={() => { }}>
                <div>Modal Content</div>
            </SimpleModal>
        );
        expect(screen.queryByText("Modal Content")).not.toBeInTheDocument();
    });

    it("renders children when isOpen is true", () => {
        render(
            <SimpleModal isOpen={true} onClose={() => { }}>
                <div>Modal Content</div>
            </SimpleModal>
        );
        expect(screen.getByText("Modal Content")).toBeInTheDocument();
    });

    it("calls onClose when close button is clicked", () => {
        const onCloseMock = vi.fn();
        render(
            <SimpleModal isOpen={true} onClose={onCloseMock}>
                <div>Test Body</div>
            </SimpleModal>
        );
        fireEvent.click(screen.getByText("×"));
        expect(onCloseMock).toHaveBeenCalled();
    });
});