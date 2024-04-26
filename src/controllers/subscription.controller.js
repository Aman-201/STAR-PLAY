import { ObjectId } from "bson"
import {User} from "../models/user.model.js"
import {Subscription} from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    const subscriber=req.user._id
    const subscriptionExist=await Subscription.findOne({channel:channelId,subscriber});
    if(!subscriptionExist)
    {
        const addSubscription=await Subscription.create({channel:channelId,subscriber});
        if(!addSubscription)
        throw new ApiError(400,"Subscription to channel Failed");
        return res.status(200).json(new ApiResponse(200,addSubscription,"Subscribed to channel"))
    }
    else
    {
        const removeSubscription=await Subscription.findByIdAndDelete(subscriptionExist._id);
        if(!removeSubscription)
        throw new ApiError(400,"de-Subscription to channel Failed");
        return res.status(200).json(new ApiResponse(200,removeSubscription,"de-Subscribed to channel"))
    }
    // TODO: toggle subscription
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params;
    //can make the response data more easily structured for frontend 
    const channelExist=await User.findById(channelId);
    if(!channelExist)
    throw new ApiError(400,"Channel does not exist");
    const subscribers=await Subscription.aggregate([
        {
            $match:{
                channel:new ObjectId(channelId)
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"subscriber",
                foreignField:"_id",
                as:"subscribers",
            },
        },
        {
            $project:{
                _id:1,
                subscribers:["$subscribers.fullname","$subscribers.email"],
                
            }
        }
    ])
    console.log(subscribers)
    res.status(200).json(new ApiResponse(200,subscribers,"Subscribers of the channel are as follows:"))
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    const user=await User.findById(subscriberId);
    if(!user)
    throw new ApiError(400,"Subscriber does not exist");
    const getSubscribedChannels=await Subscription.aggregate([
        {
            $match:{
                subscriber:new ObjectId(subscriberId)
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"channel",
                foreignField:"_id",
                as:"subscribedChannels",
            }
        },{
            $project:{
                _id:1,
                subscribedChannels:["$subscribedChannels.fullname","$subscribedChannels.username"]
            }
        }
    ])
    res.status(200).json(new ApiResponse(200,getSubscribedChannels,"Subscribed channels are as follows:"))

})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}