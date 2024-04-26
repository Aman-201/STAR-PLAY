import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import { ObjectId } from "bson";
import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";

const getVideoComments=asyncHandler(async(req,res)=>{
    const {videoId}=req.params;
    const {page=1,limit=10}=req.query;
    const video=await Video.findById({_id:new ObjectId(videoId)})
    if(!video)
    throw new ApiError(400,"User must comment on a Valid Video");
    const comments=await Comment.aggregatePaginate(await Comment.aggregate([
        {
            $match:{
                video:video._id
            }
        }
    ]),{page,limit})
    if(!comments)
    {
        throw new ApiError(400,"Comments not found");
    }
    return res.status(200).json(new ApiResponse(200,comments,"Comments fetched successfully for the given Video"))

})
const addComments=asyncHandler(async(req,res)=>{
    const {videoId}=req.params;
    const {content}=req.body;
    console.log(videoId)
    console.log(new ObjectId("661e8749bfd93673b8be2c51"))
    const video=await Video.findById({_id:new ObjectId(videoId)})
    if(!video)
    throw new ApiError(400,"User must comment on a Valid Video");
    const owner=req.user._id;
    if(!owner || !content)
    throw new ApiError(400,"User must be logged in and must comment on a video");
    const comment=Comment.create({owner,content,video:new ObjectId(videoId)})
    if(!comment)
    {
        throw new ApiError(400,"Comment not added");
    }
    return res.status(200).json(new ApiResponse(200,comment,"Comment added successfully"))
})

const deleteComments=asyncHandler(async(req,res)=>{
    const {commentId}=req.params;
    const commentIsValid=await Comment.findById({_id:new ObjectId(commentId)})
    if(!commentIsValid)
    throw new ApiError(400,"User must select a valid comment to delete");
    const comment=await Comment.findByIdAndDelete(new ObjectId(commentId)).select("-owner -video")
    if(!comment)
    {
        throw new ApiError(400,"Comment not deleted");
    }
    return res.status(200).json(new ApiResponse(200,comment,"Comment deleted successfully"))
})

const updateComments=asyncHandler(async(req,res)=>{
    const {commentId}=req.params;
    const {content}=req.body;
    if(!content)
    return res.status(200).json(new ApiResponse(200,content,"No change in Comment"))
    const commentIsValid=await Comment.findById({_id:new ObjectId(commentId)})
    if(!commentIsValid)
    throw new ApiError(400,"User must select a valid comment to update");
    const comment=await Comment.findByIdAndUpdate(new ObjectId(commentId),{content}).select("-owner -video")
    console.log(comment)
    if(!comment)
    {
        throw new ApiError(400,"Comment not Updated");
    }
    return res.status(200).json(new ApiResponse(200,comment,"Comment updated successfully"));
})



export {addComments,updateComments,deleteComments,getVideoComments}