import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { apiCallBegan } from "../../middleware/apiActions";

export interface Category {
  id: string;
  name: string;
}

interface CategoriesState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  categories: [],
  loading: false,
  error: null,
};

const slice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    categoriesRequested(state) {
      state.loading = true;
      state.error = null;
    },
    categoriesReceived(state, action: PayloadAction<Category[]>) {
      state.categories = action.payload;
      state.loading = false;
    },
    categoriesRequestFailed(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    categoryAdded(state, action: PayloadAction<Category>) {
      state.categories.push(action.payload);
    },
    categoryUpdated(state, action: PayloadAction<Category>) {
      const idx = state.categories.findIndex((c) => c.id === action.payload.id);
      if (idx !== -1) state.categories[idx] = action.payload;
    },
  },
});

const {
  categoriesRequested,
  categoriesReceived,
  categoriesRequestFailed,
  categoryAdded,
  categoryUpdated,
} = slice.actions;

// Action creators for API calls
const url = "/categories";

export const fetchCategories = () =>
  apiCallBegan({
    url,
    onStart: categoriesRequested.type,
    onSuccess: categoriesReceived.type,
    onError: categoriesRequestFailed.type,
  });

export const addCategory = (category: Omit<Category, "id">) =>
  apiCallBegan({
    url,
    method: "post",
    data: category,
    onSuccess: categoryAdded.type,
    onError: categoriesRequestFailed.type,
  });

export const updateCategory = (id: string, updates: Partial<Category>) =>
  apiCallBegan({
    url: `${url}/${id}`,
    method: "patch",
    data: updates,
    onSuccess: categoryUpdated.type,
    onError: categoriesRequestFailed.type,
  });

export default slice.reducer;
