import { mongoose, Schema } from "mongoose";
import { types } from "npm/lib/config/core";
import mongooseAgregatePaginate from "mongoose-agregate=paginate-v2"
const videoSchema=new Schema({
videoFile:{
    type:String,
    required:true
},
thumbnail:{
    type:String,
    required:true
},
title:{
    type:String,
    required:true
},
description:{
    type:String,
    required:true
},
duration:{
    type:String,
    required:true
},
views:{
    type:String,
    required:true
},
isPublished:{
    type:Boolean,
    required:true
},
owner:{
    type:Schema.Types.ObjectId,
    ref:"User"
}

},{timestamps:true})
videoSchema.plugin(mongooseAgregatePaginate)
export const Video=mongoose.model("Video",videoSchema);