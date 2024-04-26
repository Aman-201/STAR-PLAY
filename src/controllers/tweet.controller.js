import {asyncHandler} from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import { Tweet } from '../models/tweet.model.js';

const createTweet=async(req,res)=>
{
    const {content}=req.body;
    const owner=req.user._id;

    if(!content)
    throw new ApiError(400, "No content to tweet");
    const tweet=await Tweet.create({content,owner});
    if(!tweet)
    throw new ApiError(400, "Tweet not created");
return res.status(200).json(new ApiResponse(200,tweet,"Tweet added successfully"));
}

const updateTweet=async(req,res)=>
{
    const {tweetId}=req.params;
    const {content}=req.body;
    console.log(tweetId, content)
    if(!content)
    throw new ApiError(400, "No content to update");
    const tweetExist= await Tweet.findById(tweetId).select("-owner");
    if(!tweetExist)
    throw new ApiError(400, "Tweet does not exist");
    const tweet=await Tweet.findByIdAndUpdate(tweetId,{content}).select("-owner");
    if(!tweet)
    throw new ApiError(400, "Tweet not updated");
return res.status(200).json(new ApiResponse(200,tweet,"Tweet updated successfully"));
}

const deleteTweet=async(req,res)=>
{
    const tweetId=req.params;

    const tweetExist= await Tweet.findById(tweetId).select("-owner");
    if(!tweetExist)
    throw new ApiError(400, "Tweet does not exist");
    const tweet=await Tweet.findByIdAndDelete(tweetId);
    if(!tweet)
    throw new ApiError(400, "Tweet not Deleted");
return res.status(200).json(new ApiResponse(200,tweet,"Tweet Deleted successfully"));
}
const getUserTweets=asyncHandler(async(req,res)=>{
const tweets=await Tweet.aggregate([
    {
        $match:{
            owner:req.user._id
        }
    }
])
return res.status(200).json(new ApiResponse(200,tweets,"Tweets fetched successfully"));
})
export {createTweet,updateTweet,deleteTweet,getUserTweets}