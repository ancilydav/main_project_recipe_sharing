import express from "express";

import { createRecipe,getRecipes,getRecipeById,updateRecipe,deleteRecipe } from "../controllers/recipeController.js";
import authMiddleware from "../middleware/authMiddleware.js"

const router = express.Router();
router.post("/",authMiddleware,createRecipe);
router.get("/",getRecipes);
router.get("/:id",getRecipeById);
router.put("/:id",authMiddleware,updateRecipe);
router.delete("/:id",authMiddleware,deleteRecipe);

export default router;