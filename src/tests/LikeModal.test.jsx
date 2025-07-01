import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import LikeModal from "../components/LikeModal";
import axios from "axios";
import { vi } from "vitest";
import { BrowserRouter } from "react-router-dom";

vi.mock("axios");

const mockData = [
  {
    _id: "1",
    name: "John Doe",
    profilePic: { url: "http://example.com/pic.jpg" },
  },
  {
    _id: "2",
    name: "Jane Smith",
    profilePic: { url: "http://example.com/pic2.jpg" },
  },
];

const renderComponent = (props) =>
  render(
    <BrowserRouter>
      <LikeModal {...props} />
    </BrowserRouter>
  );

describe("LikeModal Component", () => {
  it("should not render when isOpen is false", () => {
    renderComponent({ isOpen: false, onClose: vi.fn(), id: "1" });
    expect(screen.queryByText(/no likes/i)).not.toBeInTheDocument();
  });

  it("renders loading animation initially", async () => {
    axios.get.mockResolvedValueOnce({ data: mockData });
    renderComponent({ isOpen: true, onClose: vi.fn(), id: "1" });
    expect(screen.getByTestId("loading")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
    });
  });

  it("renders fetched likes", async () => {
    axios.get.mockResolvedValueOnce({ data: mockData });
    renderComponent({ isOpen: true, onClose: vi.fn(), id: "1" });
   await waitFor(() => {
  const johnLikes = screen.getAllByText((_, node) =>
    node.textContent.includes("John Doe")
  );
  const janeLikes = screen.getAllByText((_, node) =>
    node.textContent.includes("Jane Smith")
  );

  expect(johnLikes.length).toBeGreaterThan(0);
  expect(janeLikes.length).toBeGreaterThan(0);
});
  });

  it("renders 'No Likes yet' if empty list returned", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    renderComponent({ isOpen: true, onClose: vi.fn(), id: "1" });
    await waitFor(() => {
      expect(screen.getByText("No Likes yet")).toBeInTheDocument();
    });
  });

  it("calls onClose when close button is clicked", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    const mockClose = vi.fn();
    renderComponent({ isOpen: true, onClose: mockClose, id: "1" });

    await waitFor(() => {
      const closeBtn = screen.getByRole("button");
      fireEvent.click(closeBtn);
      expect(mockClose).toHaveBeenCalled();
    });
  });
});