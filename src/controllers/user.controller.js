import errorHandler from 'npm/lib/utils/error-handler.js';
import {asyncHandler} from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js';

const registerUser=()=>{
    asyncHandler((req,res)=>{
        res.statuscode(200).json({message:"user is registered successfully"});
    })
}

const{fullname, email, password,username} =req.body;
console.log("email is",email);

if([fullname, email, password,username].some((field) => field?.trim()===""))
{
throw new ApiError(400,"all fields are required")
}


export {registerUser}