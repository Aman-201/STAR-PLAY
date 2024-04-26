import {asyncHandler} from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import { Video } from '../models/video.model.js';
import { ObjectId } from 'bson';
import { Playlist } from '../models/playlist.model.js';
import mongoose from 'mongoose';

const createPlaylist=asyncHandler(async(req,res)=>{
const {name,description}=req.body;
//we can also add a feature that no two duplicate playlist can exist but currently we are not taking that in our case

const playlist=await Playlist.create({name,description,owner:req.user._id});
if(!playlist)
throw new ApiError(400,"Error while creating a playlist");
return res.status(200).json(new ApiResponse(200,playlist,"PLAYLIST CREATED SUCCESSFULLY"))
})
const deletePlaylist=asyncHandler(async(req,res)=>{
    const {playlistId}=req.params;

    const playlistExist=await Playlist.findById(playlistId).select("-owner -videos");
    if(!playlistExist)
    throw new ApiError(400,"Playlist does not Exist");
    const playlist=await Playlist.findByIdAndDelete(playlistId);

    if(!playlist)
    throw new ApiError(400,"Error while deleting a playlist");
    return res.status(200).json(new ApiResponse(200,playlist,"PLAYLIST DELETED SUCCESSFULLY"))
    })

const getPlaylistById=asyncHandler(async(req,res)=>{
    const {playlistId}=req.params;

    const playlistExist=await Playlist.findById(playlistId).select("-owner -videos");
    if(!playlistExist)
    throw new ApiError(400,"Playlist does not Exist");
    return res.status(200).json(new ApiResponse(200,playlistExist,"PLAYLIST FETCHED SUCCESSFULLY"))
    })
 
    const addVideoToPlaylist=asyncHandler(async(req,res)=>{
        const {playlistId,videoId}=req.params;
    
        const playlistExist=await Playlist.findById(playlistId).select("-owner -videos");
        if(!playlistExist)
        throw new ApiError(400,"Playlist does not Exist");
        const video=await Video.findById(new ObjectId(videoId)).select("-videoFile -thumbnail")
    if(!video)
    throw new ApiError(400,"Invalid provided video Id");
        const videoAddedToPlaylist=await Playlist.findByIdAndUpdate(playlistId,{$push :{videos:videoId}})
        if(!videoAddedToPlaylist)
        throw new ApiError(400,"Video not added to Playlist");
        return res.status(200).json(new ApiResponse(200,playlistExist,"Video added to Playlist SUCCESSFULLY"))
        })    

        const deleteVideoFromPlaylist=asyncHandler(async(req,res)=>{
            const {playlistId,videoId}=req.params;
        
            const playlistExist=await Playlist.findById(playlistId).select("-owner -videos");
            if(!playlistExist)
            throw new ApiError(400,"Playlist does not Exist");
            const video=await Video.findById(new ObjectId(videoId)).select("-videoFile -thumbnail")
        if(!video)
        throw new ApiError(400,"Invalid provided video Id");
            const videoAddedToPlaylist=await Playlist.findByIdAndUpdate(playlistId,{$pull :{videos:videoId}})
            if(!videoAddedToPlaylist)
            throw new ApiError(400,"Video not removed to Playlist");
            return res.status(200).json(new ApiResponse(200,playlistExist,"Video removed to Playlist SUCCESSFULLY"))
            })   
            const updatePlaylist=asyncHandler(async(req,res)=>{
                const {name,description}=req.body;
                const {playlistId}=req.params;
        
                const playlistExist=await Playlist.findById(playlistId).select("-owner -videos");
                if(!playlistExist)
                throw new ApiError(400,"Playlist does not Exist");
                if(!name || !description)
                throw new ApiError(400,"Nothing changed in Playlist");
                const playlist=await Playlist.findByIdAndUpdate(playlistId,{name,description});
                if(!playlist)
                throw new ApiError(400," Playlist Not updated");
                return res.status(200).json(new ApiResponse(200,playlist," Playlist Details Updated SUCCESSFULLY"))
                
            })
const getUserPlaylists=asyncHandler(async(req,res)=>{
    const playlist=await Playlist.aggregate([
        {
            $match:{
                owner:req.user_id
            }
        }
    ])
    res.status(200).json(new ApiResponse(200,playlist,"User Playlists fetched successfully"))
})
export {createPlaylist,getPlaylistById,deletePlaylist,addVideoToPlaylist,deleteVideoFromPlaylist,updatePlaylist,getUserPlaylists}