import { DEBUG_MODE } from "../config";
import { ValidationError } from "joi";
import CustomErrorHandler from "../service/CustomErrorHandler";
const errorHandler = (err,req,res,next)=>{
    let statusCode = 500;
    
    let data = {
        message:"Internal Server Error",
        ...(DEBUG_MODE==='true' && {originalError: err.message})         
    }

    if(err instanceof ValidationError){
        statusCode=422;
        data = {
            message:err.message,
        }
    }

    if(err instanceof CustomErrorHandler){
        statusCode = err.statusCode;
        data = {
            messgae:err.message
        }
    }

    return res.status(statusCode).json(data);
}

export default errorHandler;