import mongoose, {isValidObjectId} from "mongoose"
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
    const {channelId} = req.params
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}