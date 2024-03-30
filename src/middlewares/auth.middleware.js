import jwt  from "jsonwebtoken"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js";
export const verifyJwt=async(req,res,next)=>{
  try{  const token=await req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
    if(!token)
    throw new ApiError("401","Unauthorized request");
const decodedToken= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
const user=await User.findById(decodedToken?._id).select("-password -refreshToken");
if(!user)
throw new ApiError("401","Unauthorized request");
req.user=user;
next();
}
catch(e){throw new ApiError("400","not authorised, inside catch of verify jwt token")}
}