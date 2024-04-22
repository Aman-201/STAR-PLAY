import {asyncHandler} from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import { Video } from '../models/video.model.js';
import { ObjectId } from 'bson';
import { Like } from '../models/like.model.js';
import { Tweet } from '../models/tweet.model.js';
import { Comment } from '../models/comment.model.js';
const abc=asyncHandler(async(req,res)=>{

})
const toggleVideoLike=asyncHandler(async(req,res)=>{
const {videoId}=req.params;
const video=await Video.findById(videoId).select("-videoFile -thumbnail");
if(!video)
throw new ApiError(400,"Video Not found")
const likedBy=req.user._id;
const likeExist=await Like.findOne({video:video._id,likedBy}).select("-video -likedBy -tweet -comment");
if(!likeExist)
{
    const addLike=await Like.create({video:video._id,likedBy})
    if(!addLike)
    throw new ApiError(400,"Error while adding a like on video");
return res.status(200).json(new ApiResponse(200,addLike,"Video Liked Successfully"))

}
else{
    const deleteLike=await Like.findByIdAndDelete(likeExist._id);
    if(!deleteLike)
    {
        throw new ApiError(400,"Error while deleting a like on video");

    }
    return res.status(200).json(new ApiResponse(200,deleteLike,"Video Dis-liked Successfully"))
}


})

const toggleCommentLike=asyncHandler(async(req,res)=>{
    const {commentId}=req.params;
    console.log(req.params)
    console.log("commeny Id--",commentId)
    const comment=await Comment.findById(commentId).select("-video -owner");
    if(!comment)
    throw new ApiError(400,"Comment Not found")
    const likedBy=req.user._id;
    const likeExist=await Like.findOne({comment:comment._id,likedBy}).select("-video -likedBy -tweet -comment");
    if(!likeExist)
    {
        const addLike=await Like.create({comment:comment._id,likedBy})
        if(!addLike)
        throw new ApiError(400,"Error while adding a like on comment");
    return res.status(200).json(new ApiResponse(200,addLike,"Comment Liked Successfully"))
    
    }
    else{
        const deleteLike=await Like.findByIdAndDelete(likeExist._id);
        if(!deleteLike)
        {
            throw new ApiError(400,"Error while deleting a like on Comment");
    
        }
        return res.status(200).json(new ApiResponse(200,deleteLike,"Comment Dis-liked Successfully"))
    }
    
    
    })


    const toggleTweetLike=asyncHandler(async(req,res)=>{
        const {tweetId}=req.params;
        const tweet=await Tweet.findById(tweetId).select("-owner");
        if(!tweet)
        throw new ApiError(400,"Tweet Not found")
        const likedBy=req.user._id;
        const likeExist=await Like.findOne({tweet:tweet._id,likedBy}).select("-video -likedBy -tweet -comment");
        if(!likeExist)
        {
            const addLike=await Like.create({tweet:tweet._id,likedBy})
            if(!addLike)
            throw new ApiError(400,"Error while adding a like on tweet");
        return res.status(200).json(new ApiResponse(200,addLike,"tweet Liked Successfully"))
        
        }
        else{
            const deleteLike=await Like.findByIdAndDelete(likeExist._id);
            if(!deleteLike)
            {
                throw new ApiError(400,"Error while deleting a like on tweet");
        
            }
            return res.status(200).json(new ApiResponse(200,deleteLike,"Tweet Dis-liked Successfully"))
        }
        
        
        })

export {toggleVideoLike, toggleTweetLike, toggleCommentLike}