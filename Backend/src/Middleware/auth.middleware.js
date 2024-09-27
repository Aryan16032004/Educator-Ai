import { User } from "../Models/user.model.js";
import { ApiError } from "../Utils/apiError.js";
import { asyncHandler } from "../Utils/AsyncHandler.js";
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler(async(req,res,next)=>{

   try {
     const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
    // console.log(token);
    
     if(!token){
         throw new ApiError(401,"Unauthorized request")
     }
 
     const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
 
     const user = await User.findById(decodedToken?._id).select(
         "-password -refreshToken"
     )
 
     if(!user){
         // discuss about frontend
         throw new ApiError(401,"Invalid acccess token")
     }
 
     req.user=user;
     next()
   } catch (error) {
     throw new ApiError(401, error?.message || "invalid access token")
   }
 })