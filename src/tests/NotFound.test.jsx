import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import NotFound from "../components/NotFound";

// Mock useNavigate
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe("NotFound Component", () => {
  it("renders text correctly", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    expect(screen.getByText("Social Media")).toBeInTheDocument();
    expect(screen.getByText("Page not found")).toBeInTheDocument();
    expect(screen.getByText("sorry, this page isn't available")).toBeInTheDocument();
    expect(screen.getByText("Visit Homepage")).toBeInTheDocument();
  });

  it("calls navigate('/') when button is clicked", () => {
    const mockedNavigate = vi.fn();
    useNavigate.mockReturnValue(mockedNavigate);

    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Visit Homepage"));
    expect(mockedNavigate).toHaveBeenCalledWith("/");
  });
});