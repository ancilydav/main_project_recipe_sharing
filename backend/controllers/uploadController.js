import cloudinary from "../config/cloudinary.js";

export const uploadImage = async(req,res)=>{
    try{
        const file = req.file;
        const result = await new Promise((resolve,reject)=>{
            cloudinary.uploader
            .upload_stream(
                {
                    folder:"recipes",
                },
                (error,result)=>{
                    if(error)reject(error);
                    else resolve (result);
                }
            )
            .end(file.buffer)
        });
        res.status(200).json({
            imageUrl:result.secure_url,
        });
    }catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};