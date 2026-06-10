import { configureStore } from "@reduxjs/toolkit";
import recipeReducer from "./Features/recipeSlice"
import authReducer from "./Features/authSlice"

export const store = configureStore({
    reducer:{
        auth:authReducer,
       recipes:recipeReducer 
    }
})

