import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { apiCallBegan } from "../../middleware/apiActions";

interface AuthState {
  token: string | null;
  username: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem("token"),
  username: null,
  loading: false,
  error: null,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginRequested(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(
      state,
      action: PayloadAction<{ token: string; username: string }>
    ) {
      state.loading = false;
      state.token = action.payload.token;
      state.username = action.payload.username;
      state.error = null;
      localStorage.setItem("token", action.payload.token);
    },
    loginFailed(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    logoutRequested(state) {
      state.loading = true;
      state.error = null;
    },
    logoutSuccess(state) {
      state.token = null;
      state.username = null;
      state.error = null;
      state.loading = false;
      localStorage.removeItem("token");
    },
    logoutFailed(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

const {
  loginRequested,
  loginSuccess,
  loginFailed,
  logoutRequested,
  logoutSuccess,
} = slice.actions;

// Action creator for login
export const login = (credentials: { username: string; password: string }) =>
  apiCallBegan({
    url: "/login",
    method: "post",
    data: credentials,
    onStart: loginRequested.type,
    onSuccess: loginSuccess.type,
    onError: loginFailed.type,
  });

export const logout = () =>
  apiCallBegan({
    url: "/logout",
    method: "post",
    onStart: logoutRequested.type,
    onSuccess: logoutSuccess.type,
    onError: loginFailed.type,
  });

export default slice.reducer;
