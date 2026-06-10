import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const storedUser = JSON.parse(localStorage.getItem("user"));

const initialState = {
  user: storedUser || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
      toast.error("Logout successfully");
      localStorage.removeItem("favourites");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
