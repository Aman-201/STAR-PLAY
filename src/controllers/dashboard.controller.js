import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    const subscriberCount=await Subscription.aggregate([
        {
            $match:{
                channel:req.user._id
            },
        },
        {
            $count:"totalSubscribers"
        }
    ])
    const videoViews=await Video.aggregate([
        {
            $match:{
                owner:req.user._id
            },
            
        },
        {
            $group:{
                _id:null,
                totalViews:{$sum:"$views"}
            }
        }
    ])
    const videoCount=await Video.aggregate([
        { $match:{
             owner:req.user._id
         
         }},{
             $count:"totalVideos"
         }
     ])
     const likeCount=await Like.aggregate([
        { $match:{
            likedBy:req.user._id
        }
    },
    {
        $count:"totalLikes"
    }
     ])
     console.log(subscriberCount,videoViews,videoCount,likeCount)

   const channelStats={
         totalSubscribers:(subscriberCount[0]?.totalSubscribers===undefined)? 0 : subscriberCount[0].totalSubscribers,
         totalViews:videoViews[0].totalViews ?? 0,
         totalVideos:videoCount[0].totalVideos ?? 0,
         totalLikes:likeCount[0].totalLikes ?? 0
        }
        res.status(200).json(new ApiResponse(200,channelStats,"Stats of the channel of User are as follows:"))
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
})

const getChannelVideos = asyncHandler(async (req, res) => {
    const userVideos=await Video.aggregate([
       { $match:{
            owner:req.user._id
        
        }},{
            $project:{
                title:1,
                description:1,
                likes:1,
                views:1,
                shares:1,
                _id:1
            }
        }
    ])
    res.status(200).json(new ApiResponse(200,userVideos,"Videos of the channel of User are as follows:"))
    // TODO: Get all the videos uploaded by the channel
})

export {
    getChannelStats, 
    getChannelVideos
    }