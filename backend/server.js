import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import uploadRoutes from"./routes/uploadRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/users",userRoutes);
app.use("/api/recipes",recipeRoutes);
app.use("/api/upload",uploadRoutes);
app.get("/",(req,res)=>{
    res.send("Recipe API Running");
});

const PORT = process.env.PORT||5001;

connectDB().then(() => {
    app.listen(PORT,()=>{
        console.log(`Server running on ${PORT}`);
    });
});