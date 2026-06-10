import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
     },
     image:{
        type:String,
        required:true,
     },
     time:{
        type:String,
        required:true,
    },
    difficulty:{
        type:String,
    },
    diet:{
        type:String
    },
    cuisine:{
        type:String
    },
    author:{
        type:String
    },
    authorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    ingredients:[
        {
            type:String
        }
    ],
    steps:[
        {
            type:String
        }
    ]
});

const Recipe = mongoose.model("Recipe",recipeSchema);
export default Recipe;