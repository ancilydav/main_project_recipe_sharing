import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    favourites:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Recipe"
        }
    ]
});
const User = mongoose.model("User",userSchema);
export default User;