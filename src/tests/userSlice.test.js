import { describe, it, expect } from "vitest";
import userReducer, { setIsAuth, setUser } from "../redux/user/userSlice";
import {
    registerUser,
    loginUser,
    fetchUser,
    logoutUser,
} from "../redux/user/userActions";

// Initial state
const initialState = {
    user: null,
    isAuth: false,
    loading: false,
};

describe("userSlice reducer", () => {
    it("should return the initial state", () => {
        expect(userReducer(undefined, { type: "" })).toEqual(initialState);
    });

    it("should handle setIsAuth", () => {
        const newState = userReducer(initialState, setIsAuth(true));
        expect(newState.isAuth).toBe(true);
    });

    it("should handle setUser", () => {
        const mockUser = { name: "Harsh" };
        const newState = userReducer(initialState, setUser(mockUser));
        expect(newState.user).toEqual(mockUser);
    });

    it("should handle registerUser.fulfilled", () => {
        const action = {
            type: registerUser.fulfilled.type,
            payload: { user: { name: "NewUser" } },
        };
        const newState = userReducer(initialState, action);
        expect(newState.user).toEqual({ name: "NewUser" });
        expect(newState.isAuth).toBe(true);
        expect(newState.loading).toBe(false);
    });

    it("should handle loginUser.fulfilled", () => {
        const action = {
            type: loginUser.fulfilled.type,
            payload: { user: { name: "Harsh" } },
        };
        const newState = userReducer(initialState, action);
        expect(newState.user).toEqual({ name: "Harsh" });
        expect(newState.isAuth).toBe(true);
        expect(newState.loading).toBe(false);
    });

    it("should handle fetchUser.fulfilled", () => {
        const action = {
            type: fetchUser.fulfilled.type,
            payload: { name: "Harsh" },
        };
        const newState = userReducer(initialState, action);
        expect(newState.user).toEqual({ name: "Harsh" });
        expect(newState.isAuth).toBe(true);
        expect(newState.loading).toBe(false);
    });

    it("should handle fetchUser.rejected", () => {
        const action = { type: fetchUser.rejected.type };
        const newState = userReducer(
            { ...initialState, user: { name: "Harsh" }, isAuth: true },
            action
        );
        expect(newState.user).toBe(null);
        expect(newState.isAuth).toBe(false);
        expect(newState.loading).toBe(false);
    });

    it("should handle logoutUser.fulfilled", () => {
        const action = { type: logoutUser.fulfilled.type };
        const newState = userReducer(
            { ...initialState, user: { name: "Harsh" }, isAuth: true },
            action
        );
        expect(newState.user).toBe(null);
        expect(newState.isAuth).toBe(false);
        expect(newState.loading).toBe(false);
    });

    it("should handle any pending action", () => {
        const action = { type: "user/anyAction/pending" };
        const newState = userReducer(initialState, action);
        expect(newState.loading).toBe(true);
    });

    it("should handle any rejected action", () => {
        const action = { type: "user/anyAction/rejected" };
        const newState = userReducer({ ...initialState, loading: true }, action);
        expect(newState.loading).toBe(false);
    });

    it("should handle any fulfilled action", () => {
        const action = { type: "user/anyAction/fulfilled" };
        const newState = userReducer({ ...initialState, loading: true }, action);
        expect(newState.loading).toBe(false);
    });
});