import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Loading, LoadingAnimation } from "../components/Loading"; // adjust path as needed

describe("Loading Components", () => {
    it("renders the full page Loading component", () => {
        render(<Loading />);
        const spinner = screen.getByTestId("loading");
        expect(spinner).toBeInTheDocument();
        expect(spinner).toHaveClass("animate-spin");
        expect(spinner).toHaveClass("rounded-full");
    });

    it("renders the small LoadingAnimation component", () => {
        render(<LoadingAnimation />);
        const spinner = screen.getByTestId("loading");
        expect(spinner).toBeInTheDocument();
        expect(spinner).toHaveClass("animate-spin");
        expect(spinner).toHaveClass("border-red-500");
    });
});