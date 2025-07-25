import axios from "axios";
import * as actions from "./apiActions";
import type { Middleware } from "@reduxjs/toolkit";

const api: Middleware =
  ({ dispatch }) =>
  (next) =>
  async (action: any) => {
    if (action.type !== actions.apiCallBegan.type) return next(action);

    const { url, method, data, onStart, onSuccess, onError } = action.payload;

    if (onStart) dispatch({ type: onStart });
    next(action);

    try {
      const response = await axios.request({
        baseURL: "http://localhost:3000",
        url,
        method,
        data,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      dispatch(actions.apiCallSuccess(response.data));
      if (onSuccess) dispatch({ type: onSuccess, payload: response.data });
    } catch (error: any) {
      dispatch(actions.apiCallFailed(error.message));
      if (onError) {
        dispatch({
          type: onError,
          payload: error.message,
        });
      }
    }
  };

export default api;
