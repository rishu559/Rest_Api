import CustomErrorHandler from "../service/CustomErrorHandler";
import JwtService from "../service/Jwt Service";

const auth = async (req,res,next) =>{
    let auth_header = req.headers.authorization;
    console.log(auth_header);

    if(!auth_header){
        return next(CustomErrorHandler.unAuthorized());
    }

    const token = auth_header.split(' ')[1];
    console.log(token);

    try{
        const {_id,role} = await JwtService.verify(token);
    }
    catch(error){
        return next(CustomErrorHandler.unAuthorized());
        
        const user = {
            _id,
            role
        }

        req.user = user;
    }
}

export default auth;