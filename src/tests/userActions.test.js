import { configureStore } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";

import {
  registerUser,
  loginUser,
  fetchUser,
  logoutUser,
  followUser,
  updateProfilePic,
  updateProfileName,
} from "../redux/user/userActions.js";

vi.mock("axios");
vi.mock("react-hot-toast");

describe("User Actions", () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        user: () => ({})
      }
    });
    vi.clearAllMocks();
  });

  it("registers user successfully", async () => {
    const mockResponse = { message: "Registered", user: { name: "Test" } };
    axios.post.mockResolvedValueOnce({ data: mockResponse });

    const navigate = vi.fn();
    toast.success.mockImplementation(() => {});

    const result = await store.dispatch(registerUser({ formdata: {}, navigate }));

    expect(axios.post).toHaveBeenCalledWith("/api/auth/register", {});
    expect(toast.success).toHaveBeenCalledWith("Registered");
    expect(navigate).toHaveBeenCalledWith("/");
    expect(result.payload).toEqual(mockResponse);
  });

  it("logs in user successfully", async () => {
    const mockResponse = { message: "Logged in", user: { email: "test@test.com" } };
    axios.post.mockResolvedValueOnce({ data: mockResponse });

    const navigate = vi.fn();
    toast.success.mockImplementation(() => {});

    const result = await store.dispatch(loginUser({ email: "test@test.com", password: "pass", navigate }));

    expect(axios.post).toHaveBeenCalledWith("/api/auth/login", { email: "test@test.com", password: "pass" });
    expect(toast.success).toHaveBeenCalledWith("Logged in");
    expect(navigate).toHaveBeenCalledWith("/");
    expect(result.payload).toEqual(mockResponse);
  });

  it("fetches user successfully", async () => {
    const mockResponse = { user: { name: "Harsh" } };
    axios.get.mockResolvedValueOnce({ data: mockResponse });

    const result = await store.dispatch(fetchUser());

    expect(axios.get).toHaveBeenCalledWith("/api/user/me");
    expect(result.payload).toEqual(mockResponse);
  });

  it("logs out user successfully", async () => {
    const mockResponse = { message: "Logged out" };
    axios.get.mockResolvedValueOnce({ data: mockResponse });
    toast.success.mockImplementation(() => {});

    const result = await store.dispatch(logoutUser());

    expect(axios.get).toHaveBeenCalledWith("/api/auth/logout");
    expect(toast.success).toHaveBeenCalledWith("Logged out");
    expect(result.payload).toEqual(mockResponse);
  });

  it("follows user", async () => {
    const mockResponse = { message: "Followed" };
    const fetchUserMock = vi.fn();
    axios.post.mockResolvedValueOnce({ data: mockResponse });
    toast.success.mockImplementation(() => {});

    const result = await store.dispatch(followUser({ id: 1, fetchUser: fetchUserMock }));

    expect(axios.post).toHaveBeenCalledWith("/api/user/follow/1");
    expect(fetchUserMock).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith("Followed");
    expect(result.payload).toEqual(mockResponse);
  });

  it("updates profile picture", async () => {
    const mockResponse = { message: "Updated Pic" };
    axios.put.mockResolvedValueOnce({ data: mockResponse });
    toast.success.mockImplementation(() => {});

    const result = await store.dispatch(updateProfilePic({ id: 1, formdata: {}, fetchUser: vi.fn(), setFile: vi.fn() }));

    expect(axios.put).toHaveBeenCalledWith("/api/user/1", {});
    expect(toast.success).toHaveBeenCalledWith("Updated Pic");
    expect(result.payload).toEqual(mockResponse);
  });

  it("updates profile name", async () => {
    const mockResponse = { message: "Updated Name" };
    axios.put.mockResolvedValueOnce({ data: mockResponse });
    toast.success.mockImplementation(() => {});

    const result = await store.dispatch(updateProfileName({ id: 1, name: "Harsh Tripathi" }));

    expect(axios.put).toHaveBeenCalledWith("/api/user/1", { name: "Harsh Tripathi" });
    expect(toast.success).toHaveBeenCalledWith("Updated Name");
    expect(result.payload).toEqual(mockResponse);
  });
});