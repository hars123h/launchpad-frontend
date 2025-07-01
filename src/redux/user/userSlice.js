import { createSlice } from "@reduxjs/toolkit";
import {
    registerUser,
    loginUser,
    fetchUser,
    logoutUser,
    followUser,
    updateProfilePic,
    updateProfileName,
} from "./userActions";

const initialState = {
    user: null,
    isAuth: false,
    loading: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setIsAuth: (state, action) => {
            state.isAuth = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.isAuth = true;
                state.loading = false;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.isAuth = true;
                state.loading = false;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isAuth = true;
                state.loading = false;
            })
            .addCase(fetchUser.rejected, (state) => {
                state.user = null;
                state.isAuth = false;
                state.loading = false;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.isAuth = false;
                state.loading = false;
            })
            .addMatcher(
                (action) => action.type.endsWith("/pending"),
                (state) => {
                    state.loading = true;
                }
            )
            .addMatcher(
                (action) => action.type.endsWith("/rejected"),
                (state) => {
                    state.loading = false;
                }
            )
            .addMatcher(
                (action) => action.type.endsWith("/fulfilled"),
                (state) => {
                    state.loading = false;
                }
            );
    },
});

export const { setIsAuth, setUser } = userSlice.actions;
export default userSlice.reducer;