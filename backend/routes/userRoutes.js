import express from "express";
import { registerUser, loginUser, getFavourites, addFavourite, removeFavourite } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/favourites", authMiddleware, getFavourites);
router.post("/favourites/:id", authMiddleware, addFavourite);
router.delete("/favourites/:id", authMiddleware, removeFavourite);

export default router;
