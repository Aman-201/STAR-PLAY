import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import { Video } from "../models/video.model.js";
import { getCurrentUser } from "./user.controller.js";
import jwt from 'jsonwebtoken';
import { ObjectId } from "bson"


//at the end
const getAllVideos=asyncHandler(async(req,res)=>{

})
const publishVideo=asyncHandler(async(req,res)=>{
    console.log(req.user._id)
const  {title,description}=req.body;
console.log(title,description)
console.log(req.files.videoFile[0].path)
    if(title==undefined || description==undefined)
    throw new ApiError(400,"title and description are compulsory fields")
    const thumbnailLocalPath="";
    try{
        thumbnailLocalPath=req.files?.thumbnail[0]?.path;
    }
    catch(e){
console.log("thumbnail not uploaded")
    }
// if(req.files?.thumbnail!=undefined)

let videoLocalPath="";
try{videoLocalPath=req.files.videoFile[0].path}catch(e){ console.log(e);throw new ApiError(400,"video must be uploaded before publishing")}
// if(!videoLocalPath)
// throw new ApiError(400,"video must be uploaded before publishing")

const thumbnailPath=(thumbnailLocalPath==="")?"":await uploadOnCloudinary(thumbnailLocalPath);
const videoPath=await uploadOnCloudinary(videoLocalPath);
const duration=videoPath.duration;
const thumbnailUrl=(thumbnailPath==="")?"":thumbnailPath?.url ?? "";
const videoUrl=videoPath.url;
const video=await Video.create({title,description,thumbnail:thumbnailUrl,videoFile:videoUrl,duration,owner:req.user._id,views:0,isPublished:true});
const publishedVideo=await Video.findById(video._id).select("-videoFile -thumbnail");
if(!publishVideo)
{
    throw new ApiError(400,"Error while publishing a video");
}
return res.status(200).json(new ApiResponse(200,publishedVideo,"Video Published successfully"));
})

const getVideoById=asyncHandler(async(req,res)=>{
    console.log("hello")
    console.log(req.params)
const {videoId}=req.params;
console.log(videoId)
console.log(typeof(videoId))
const id= `ObjectId("${videoId}")`;
    const video=await Video.findById(new ObjectId(videoId)).select("-videoFile -thumbnail")
    if(!video)
    throw new ApiError(400,"Invalid provided video Id");
    return res.status(200).json(new ApiResponse(200,video,"fetched the video by id successfully"));

})
const updateVideo=asyncHandler(async(req,res)=>{
    console.log(req.files)
    const {videoId}=req.params;
    const  {title,description}=req.body;
    if(!title || !description)
    throw new ApiError(400,"title and description ")
    let thumbnailLocalPath="";
    try{
        console.log(req.files.thumbnail[0].path)
        thumbnailLocalPath=await req.files.thumbnail[0].path;
       
    }
    catch(e){
        console.log(e)
console.log("thumbnail not uploaded")
    }
// if(req.files?.thumbnail!=undefined)

let videoLocalPath="";
try{videoLocalPath=req.files.videoFile[0].path}catch(e){ console.log("VIDEO NOT UPDATED"); }
    const thumbnailPath=(thumbnailLocalPath==="")?"":await uploadOnCloudinary(thumbnailLocalPath);
const videoPath=await uploadOnCloudinary(videoLocalPath);

const thumbnailUrl=(thumbnailPath==="")?"":thumbnailPath?.url;
const videoUrl=videoPath?.url;
const updatedEntries={title,description};
if(videoUrl)
{
    const duration=videoPath.duration ?? 0;
    console.log(duration)
    updatedEntries.videoFile=videoUrl
    updatedEntries.duration=duration
}
if(thumbnailUrl)
{
    updatedEntries.thumbnail=thumbnailUrl
}
    const id= `ObjectId("${videoId}")`;
    const video=await Video.findByIdAndUpdate(new ObjectId(videoId),updatedEntries).select("-videoFile -thumbnail")
    if(!video)
    throw new ApiError(400,"Invalid provided video Id");
    return res.status(200).json(new ApiResponse(200,video,"updated the video by id successfully"));
})
const deleteVideo=asyncHandler(async(req,res)=>{
    const {videoId}=req.params;
    const deletedVideo=await Video.findByIdAndDelete(new ObjectId(videoId));
    console.log(deleteVideo)
    if(!deletedVideo)
    throw new ApiError(400,"error while deleteing a video");
    return res.status(200).json(new ApiResponse(200,deletedVideo,"deleted the video by id successfully"));

})
export {publishVideo,getVideoById,updateVideo,deleteVideo}

