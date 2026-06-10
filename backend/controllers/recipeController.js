import Recipe from "../models/Recipe.js";
import User from "../models/User.js";
// Create Recipe

export const createRecipe = async (req,res)=>{
    try{
        const user = await User.findById(req.user.id).select("name");
        const recipe = await Recipe.create({
            ...req.body,
            author: user?.name || req.body.author,
            authorId: req.user.id,
        });
        res.status(201).json(recipe);
    }catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};

// Get All Recipes
export const getRecipes = async(req,res)=>{
    try{
        let query = {};
        if(req.query.search){
            query.name={
                $regex:req.query.search,
                $options:"i"
            };
        }
        // filter
        if(req.query.cuisine){
            query.cuisine= req.query.cuisine;
        }
        if(req.query.difficulty){
            query.difficulty = req.query.difficulty;
        }
        if(req.query.diet){
            query.diet = req.query.diet;
        }
              
        const recipes = await Recipe.find(query);
        res.json(recipes);
    }catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};

// get Single Recipe

export const getRecipeById = async(req,res)=>{
    try{
        const recipe = await Recipe.findById(req.params.id);
        if(!recipe){
            return res.status(404).json({
                message:"Recipe not found"
            });
        }
        res.json(recipe);
    }catch (error){
        res.status(500).json({
            message:error.message
        });
    }
};

// Update Recipe

export const updateRecipe = async (req,res) =>{
    try{
        const recipe = await Recipe.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        );
        res.json(recipe);
    }catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};

// Delete recipe
export const deleteRecipe = async(req,res)=>{
    try{
        await Recipe.findByIdAndDelete(req.params.id);
        res.json({
            message:"recipe deleted"
        });
    }catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};
