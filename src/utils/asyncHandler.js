export const asyncHAndler=(handlerFunction)=>{
    (req,res,next)=>{
        Promise.resolve(handlerFunction(req,res,next)).catch((err)=>next(err));
    }

}