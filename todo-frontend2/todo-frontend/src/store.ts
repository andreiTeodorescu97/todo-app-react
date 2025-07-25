import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import todosReducer from "./features/todos/todosSlice";
import categoriesReducer from "./features/categories/categoriesSlice";
import userReducer from "./features/user/userSlice";
import api from "./middleware/api";

const store = configureStore({
  reducer: {
    auth: authReducer,
    todos: todosReducer,
    categories: categoriesReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
