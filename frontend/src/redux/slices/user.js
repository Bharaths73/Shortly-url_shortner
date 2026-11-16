import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isInitialized: false,
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser(state, action) {
            state.user = action.payload;
        },
        setAccessToken(state, action) {
            state.accessToken = action.payload;
        },
        setCredentials: (state, action) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.isAuthenticated = true;
            state.isInitialized = true;
        },

        clearCredentials: (state) => {
            state.user = null;
            state.accessToken = null;
            state.isAuthenticated = false;
            state.isInitialized = true;
        },
    }
});

export const { setUser, setAccessToken, setCredentials, clearCredentials } = userSlice.actions;
export default userSlice.reducer;
