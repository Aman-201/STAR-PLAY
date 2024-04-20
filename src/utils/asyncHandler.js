export const asyncHandler=(handlerFunction)=>{
   return (req,res,next)=>{
        Promise.resolve(handlerFunction(req,res,next)).catch((err)=>{console.log("inside catch of async handler",err)});
    }

}