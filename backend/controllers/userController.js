import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

// Register
 dotenv.config();
export const registerUser = async (req,res)=>{
    try{
        const {name,email,password}= req.body;
        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({
                message:"user already exists"
            });
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const user = await User.create({
            name,
            email,
            password:hashedPassword
        });
        res.status(201).json(user);
    }catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};

// login

export const loginUser = async (req,res)=>{
    try{
        const {email,password}= req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message:"invalid email"
            }); 
        }
        const verified = await bcrypt.compare(
            password,
            user.password
        );
        if(!verified){
            return res.status(400).json({
                message:"invalid password"
            });
        }
        const token = jwt.sign(
            {id:user._id},
            process.env.JWT_SECRET,
            {expiresIn:"7d"}
        );
        res.json({
            token,
            user
        });
    }catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};

export const getFavourites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favourites");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user.favourites || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addFavourite = async (req, res) => {
  try {
    const recipeId = req.params.id;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.favourites.includes(recipeId)) {
      user.favourites.push(recipeId);
      await user.save();
    }
    await user.populate("favourites");
    res.json(user.favourites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFavourite = async (req, res) => {
  try {
    const recipeId = req.params.id;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.favourites = user.favourites.filter((favId) => favId.toString() !== recipeId);
    await user.save();
    await user.populate("favourites");
    res.json(user.favourites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};