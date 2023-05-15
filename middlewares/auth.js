import CustomErrorHandler from "../service/CustomErrorHandler";
import JwtService from "../service/Jwt Service";
import admin from "./admin";

const auth = async (req,res,next) =>{
    let auth_header = req.headers.authorization;


    if(!auth_header){
        return next(CustomErrorHandler.unAuthorized());
    }

    const token = auth_header.split(' ')[1];


    try{
        const {_id,role} = await JwtService.verify(token);

        const user = {
            _id,
            role
        }

        req.user = user;
    
        next();
    }
    catch(error){
        return next(CustomErrorHandler.unAuthorized());  
    }
}

export default auth;