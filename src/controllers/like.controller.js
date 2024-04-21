import {asyncHandler} from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import { Video } from '../models/video.model.js';
import { ObjectId } from 'bson';
import { Like } from '../models/like.model.js';

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
export {toggleVideoLike}