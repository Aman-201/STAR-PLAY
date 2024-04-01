import mongoose, { Schema } from "mongoose";
import { types } from "npm/lib/config/defaults";

const subscriptionSchema=new mongoose.Schema({
subscriber:{
    type:Schema.Types.ObjectId,
    ref:"User"
    //one who is subscribing
},
channel:{
    type:Schema.Types.ObjectId,
    ref:"User"
    //one to whom users are subscribing
},
},{timestamps:true});
const subscription=mongoose.Model("Subscription",subscriptionSchema);
export default subscription