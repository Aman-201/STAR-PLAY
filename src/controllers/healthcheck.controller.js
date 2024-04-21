import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';

const healthCheck=asyncHandler(async(_,res)=>{

return res.status(200).json(new ApiResponse(200,{'working':'Siuccess'},"Application running successfully"))
})
export  {healthCheck};