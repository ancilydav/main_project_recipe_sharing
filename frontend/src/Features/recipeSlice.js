import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { logout } from "./authSlice";
import axiosInstance from "../api/axios";

export const fetchRecipes = createAsyncThunk(
  "recipes/fetchRecipes",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/recipes");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "failed to fetch recipes"
      );
    }
  }
);

export const createRecipe = createAsyncThunk(
  "recipes/createRecipe",
  async (recipeData, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth?.user?.token;
      const response = await axiosInstance.post("/recipes", recipeData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

export const deleteRecipeThunk = createAsyncThunk(
  "recipes/deleteRecipe",
  async (id, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth?.user?.token;
      await axiosInstance.delete(`/recipes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

export const updateRecipeThunk = createAsyncThunk(
  "recipes/updateRecipe",
  async ({ id, recipeData }, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth?.user?.token;
      const response = await axiosInstance.put(`/recipes/${id}`, recipeData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchFavourites = createAsyncThunk(
  "recipes/fetchFavourites",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth?.user?.token;
      const response = await axiosInstance.get("/users/favourites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

export const addFavouriteThunk = createAsyncThunk(
  "recipes/addFavourite",
  async (recipeId, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth?.user?.token;
      const response = await axiosInstance.post(
        `/users/favourites/${recipeId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

export const removeFavouriteThunk = createAsyncThunk(
  "recipes/removeFavourite",
  async (recipeId, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth?.user?.token;
      await axiosInstance.delete(`/users/favourites/${recipeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return recipeId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

const initialState = {
  recipes: [],
  search: "",
  diet: "All",
  cuisine: "All",
  difficulty: "All",
  favourites: [],
  loading: false,
  error: null,
};

const recipeSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    setSearch(state, action) {
      state.search = action.payload;
    },
    setCuisine(state, action) {
      state.cuisine = action.payload;
    },
    setDiet(state, action) {
      state.diet = action.payload;
    },
    setDifficulty(state, action) {
      state.difficulty = action.payload;
    },
    addFavourite(state, action) {
      const payload = action.payload;
      if (typeof payload === "string") {
        const recipe = state.recipes.find((r) => r._id === payload || r.id === payload);
        if (recipe && !state.favourites.some((f) => (f._id || f.id) === (recipe._id || recipe.id))) {
          state.favourites.push(recipe);
        }
      } else {
        const id = payload?._id || payload?.id;
        if (id && !state.favourites.some((f) => (f._id || f.id) === id)) {
          state.favourites.push(payload);
        }
      }
    },
    removeFavourite(state, action) {
      const idToRemove = typeof action.payload === "string" ? action.payload : action.payload?._id || action.payload?.id;
      state.favourites = state.favourites.filter((fav) => (fav._id || fav.id) !== idToRemove);
    },
    addRecipe(state, action) {
      state.recipes.push(action.payload);
    },
    deleteRecipe(state, action) {
      const id = action.payload;
      state.recipes = state.recipes.filter((r) => r._id !== id && r.id !== id);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.recipes = action.payload;
        state.error = null;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || "Failed to fetch";
      })
      .addCase(createRecipe.fulfilled, (state, action) => {
        state.recipes.unshift(action.payload);
        state.error = null;
      })
      .addCase(createRecipe.rejected, (state, action) => {
        state.error = action.payload || action.error?.message || "Failed to create";
      })
      .addCase(deleteRecipeThunk.fulfilled, (state, action) => {
        const id = action.payload;
        state.recipes = state.recipes.filter((r) => r._id !== id && r.id !== id);
      })
      .addCase(updateRecipeThunk.fulfilled, (state, action) => {
        const updated = action.payload;
        const id = updated?._id || updated?.id;
        if (!id) return;
        state.recipes = state.recipes.map((r) => ((r._id || r.id) === id ? updated : r));
      })
      .addCase(deleteRecipeThunk.rejected, (state, action) => {
        state.error = action.payload || action.error?.message || "Failed to delete";
      })
      .addCase(fetchFavourites.fulfilled, (state, action) => {
        state.favourites = action.payload;
      })
      .addCase(fetchFavourites.rejected, (state, action) => {
        state.error = action.payload || action.error?.message || "Failed to load favourites";
      })
      .addCase(addFavouriteThunk.fulfilled, (state, action) => {
        const recipe = action.payload;
        const id = recipe?._id || recipe?.id;
        if (id && !state.favourites.some((f) => (f._id || f.id) === id)) {
          state.favourites.push(recipe);
        }
      })
      .addCase(addFavouriteThunk.rejected, (state, action) => {
        state.error = action.payload || action.error?.message || "Failed to add favourite";
      })
      .addCase(removeFavouriteThunk.fulfilled, (state, action) => {
        const id = action.payload;
        state.favourites = state.favourites.filter((fav) => (fav._id || fav.id) !== id);
      })
      .addCase(removeFavouriteThunk.rejected, (state, action) => {
        state.error = action.payload || action.error?.message || "Failed to remove favourite";
      })
      .addCase(logout, (state) => {
        state.favourites = [];
      });
  },
});


export const {
  setSearch,
  setCuisine,
  setDiet,
  setDifficulty,
  addFavourite,
  removeFavourite,
  addRecipe,
  deleteRecipe,
} = recipeSlice.actions;
export default recipeSlice.reducer;
 
