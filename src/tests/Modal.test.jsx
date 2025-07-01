import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Modal from "../components/Modal"; // adjust path if needed

const renderComponent = (props) => {
    return render(
        <BrowserRouter>
            <Modal {...props} />
        </BrowserRouter>
    );
};

describe("Modal Component", () => {
    const mockData = [
        {
            _id: "1",
            name: "Alice",
            profilePic: { url: "http://example.com/pic1.jpg" },
        },
        {
            _id: "2",
            name: "Bob",
            profilePic: { url: "http://example.com/pic2.jpg" },
        },
    ];

    it("renders the modal title and users", () => {
        renderComponent({ value: mockData, title: "Followers", setShow: vi.fn() });

        expect(screen.getByText("Followers")).toBeInTheDocument();
        expect(screen.getAllByText((_, node) => node.textContent.includes("Alice"))[0]).toBeInTheDocument();
        expect(screen.getAllByText((_, node) => node.textContent.includes("Bob"))[0]).toBeInTheDocument();
        expect(screen.getAllByRole("link").length).toBe(2);
    });

    it("renders 'No Followers yet' if value is empty", () => {
        renderComponent({ value: [], title: "Followers", setShow: vi.fn() });

        expect(screen.getByText("No Followers yet")).toBeInTheDocument();
    });

    it("calls setShow(false) when close button is clicked", () => {
        const mockSetShow = vi.fn();
        renderComponent({ value: mockData, title: "Followers", setShow: mockSetShow });

        const closeBtn = screen.getByText("×");
        fireEvent.click(closeBtn);

        expect(mockSetShow).toHaveBeenCalledWith(false);
    });

    it("calls setShow(false) when a user link is clicked", () => {
        const mockSetShow = vi.fn();
        renderComponent({ value: mockData, title: "Followers", setShow: mockSetShow });

        const links = screen.getAllByRole("link");
        fireEvent.click(links[0]);

        expect(mockSetShow).toHaveBeenCalledWith(false);
    });
});