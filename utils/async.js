// Try catch block will be handeled with this file

export const asyncHandler = fn => (req,res,next)=>{
    Promise.resolve(fn(req,res,next)).catch(next);};

export default asyncHandler;