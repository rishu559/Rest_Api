import Joi from "joi";
import CustomErrorHandler from "../../service/CustomErrorHandler";
import JwtService from "../../service/Jwt Service";
import refreshToken from "../../models/refreshToken";
import { REF_TOKEN } from "../../config";
import { RefreshToken, User } from "../../models";

const refreshController = {
    refresh: async (req,res,next) => {
        // validate
        const refreshSchema = Joi.object({
            refreshToken:Joi.string().required()
        })

        console.log("1");
        const {error} = refreshSchema.validate(req.body);
        
        if(error){
            return next(error);
        }

        console.log("2");
        // If token in database
        let refresh_token;
        try{
            console.log(req.body.refreshToken);

            refresh_token = await RefreshToken.findOne({
                token:req.body.refreshToken
            })

            console.log("3");
            if(!refresh_token){
                return next(CustomErrorHandler.unAuthorized("Invalid Refresh Token"));
            } 

            // verify refresh token
            let userID;
            try{
                const {_id} = await JwtService.verify(refresh_token.token,REF_TOKEN);
                userID = _id;
            }
            catch(error){
                return next(CustomErrorHandler.unAuthorized("Invalid Refresh Token"));
            }

            // verify if user is in db
            const user = User.findOne({_id:userID});
            if(!user){
                return next(CustomErrorHandler.unAuthorized("No User Found"));
            }
            
            //tokens
            const accessToken = JwtService.sign({_id:user._id,role:user.role})
            const refreshNewToken = JwtService.sign({_id:user._id,role:user.role},'1y',REF_TOKEN)

            await RefreshToken.create({token:refreshToken});
            res.json({accessToken,refreshNewToken})

        }
        catch(error){
            console.log(error.message);
            return next(new Error('Something Went Wrong',error.message));
        }

    }

}
export default refreshController;