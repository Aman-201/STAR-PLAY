import {asyncHandler} from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import jwt from 'jsonwebtoken';
const generateAccessAndRefreshToken=async(user)=>
{
    const accessToken=user.generateAccessToken();
    const refresToken=user.generateRefreshToken();
    user.refresToken=refresToken;
    await user.save({validateBeforeSave:false});
    return {accessToken,refresToken};
}
const registerUser=asyncHandler(async(req,res)=>{
        console.log("inside user controlle");
        const{fullname, email, password,username} =req.body;
        console.log("email is",email);
        
        if([fullname, email, password,username].some((field) => field?.trim()===""))
        {
        throw new ApiError(400,"all fields are required")
        }
        const existedUser=await User.findOne({
            $or:[{email},{username}]
        })
        if(existedUser)
        {
            throw new ApiError(409,"User alredy exists with same email or username");
        }
        
        const avatarLocalPath=req.files?.avatar[0]?.path;
        const coverImageLocalPath="";
        if(req.files?.coverImage)
        { coverImageLocalPath=req.files?.coverImage[0]?.path;}
        
        if(!avatarLocalPath)
        throw new ApiError("400","Upload Avatar Image");
        
        const avatar=await uploadOnCloudinary(avatarLocalPath);

        const coverImage=await uploadOnCloudinary(coverImageLocalPath);
        
        if(!avatar)
        throw new ApiError("400","Upload Avatar Image");
        
        const user=await User.create({
            fullname,avatar:avatar.url,coverImage:(coverImage?.url || ""),email,username:username.toLowerCase(),password
        })
        const createdUser=await User.findById(user._id).select("-password -refreshToken")
        if(!createdUser)
        throw new ApiError(500,"Something went wrong while registering the user")
         res.status(201).json(
            new ApiResponse(200,createdUser,"user registered successfully")
        );
        // res.statuscode(200).json({message:"user is registered successfully"});
    })

    const loginUser=asyncHandler(async(req,res)=>{
        // const username=req.body?.username || '';
        // const email=req.body?.email || '';
        // const password=req.body.password;
        const {username,password,email}=req.body;
        console.log(req)
        console.log(username,email,password)
        if(password==undefined || (username==undefined && email==undefined))
        throw new ApiError("400","username/email and password is required")
        const existedUser=await User.findOne({
            $or:[{email},{username}]
        })
        if(!existedUser)
        {
            throw new ApiError("400","No user found");
        }
        const authenticUser=await existedUser.isPasswordCorrect(existedUser.password);
        if(!authenticUser)
        throw new ApiError("400","Wrong Password");
       const {refresToken,accessToken}=await generateAccessAndRefreshToken(existedUser);
        const addToken=await User.update({'_id':existedUser._id},{$set:{"accessToken":accessToken,"refreshToken":refresToken}});
        console.log("tokens added to db")
        const loggedinUser=await User.findById(user._id).select("-password -refreshToken")
        const options={
            httpOnly:true,
            secure:true
        }
        return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refresToken,options).json(new ApiResponse(200,{user:loggedinUser,refresToken,accessToken},"user logged in successfully"))
    })
const logoutUser=asyncHandler(async(req,res)=>{
    const user=await User.findByIdAndUpdate(req.user._id,{$set:{refreshToken:undefined}},{new:true});
    return res.status(200).clearCookie("accessToken").clearCookie("refreshToken").json(new ApiResponse(200,{},"user logged out"))

})
const refreshAccessToken=asyncHandler(async (req,res)=>{
    const incomingRefreshToken=req.body?.refresToken || req.cookie.refresToken;
    if(!incomingRefreshToken)
    throw new ApiError(401,"Unauthorized request, user logged off")
    try{
        const decodedToken=jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET);
    if(!decodedToken)
    throw new ApiError(401,"Unauthorized request, invalid refresh token");
    const user= await findById(decodedToken._id);
    if(!user)
    throw new ApiError(401,"Unauthorized request, user not found with a particular id");
    const {refresToken,accessToken}=await generateAccessAndRefreshToken(user);
    const options={
        httpOnly:true,
        secure:true
    }
    res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).json(new ApiResponse(200,{accessToken,refresToken},"user refrehed the session"));
    }
    catch(error){
throw new ApiError(401,"unothorised request, inside catch of refresh access token")
    }
})


export {registerUser,loginUser,logoutUser,refreshAccessToken}