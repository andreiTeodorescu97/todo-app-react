import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { apiCallBegan } from "../../middleware/apiActions";

export interface Todo {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  completed: boolean;
}

interface TodosState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
}

const initialState: TodosState = {
  todos: [],
  loading: false,
  error: null,
};

const slice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    todosRequested(state) {
      state.loading = true;
      state.error = null;
    },
    todosReceived(state, action: PayloadAction<Todo[]>) {
      state.todos = action.payload;
      state.loading = false;
    },
    todosRequestFailed(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    todoAdded(state, action: PayloadAction<Todo>) {
      state.todos.push(action.payload);
    },
    todoUpdated(state, action: PayloadAction<Todo>) {
      const idx = state.todos.findIndex((t) => t.id === action.payload.id);
      if (idx !== -1) state.todos[idx] = action.payload;
    },
    todoDeleted(state, action: PayloadAction<Partial<Todo>>) {
      state.todos = state.todos.filter((t) => t.id !== action.payload.id);
    },
  },
});

const {
  todosRequested,
  todosReceived,
  todosRequestFailed,
  todoAdded,
  todoUpdated,
  todoDeleted,
} = slice.actions;

const url = "/todos";

export const fetchTodos = () =>
  apiCallBegan({
    url,
    onStart: todosRequested.type,
    onSuccess: todosReceived.type,
    onError: todosRequestFailed.type,
  });

export const addTodo = (todo: Omit<Todo, "id" | "completed">) =>
  apiCallBegan({
    url,
    method: "post",
    data: todo,
    onSuccess: todoAdded.type,
    onError: todosRequestFailed.type,
  });

export const updateTodo = (id: string, updates: Partial<Todo>) =>
  apiCallBegan({
    url: `${url}/${id}`,
    method: "patch",
    data: updates,
    onSuccess: todoUpdated.type,
    onError: todosRequestFailed.type,
  });

export const deleteTodo = (id: string) =>
  apiCallBegan({
    url: `${url}/${id}`,
    method: "delete",
    onSuccess: todoDeleted.type,
    onError: todosRequestFailed.type,
  });

export default slice.reducer;
