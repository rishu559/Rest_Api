import Joi from "joi";
import { RefreshToken, User } from "../../models";
import CustomErrorHandler from "../../service/CustomErrorHandler";
import bcrypt from 'bcrypt';
import JwtService from "../../service/Jwt Service";
import { REF_TOKEN } from "../../config";

const loginController = {
    async login (req,res,next){

        // validation
        const loginSchema = Joi.object({
            email:Joi.string().min(5).max(30).email(),
            password:Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        })

        const {error} = loginSchema.validate(req.body);
        // console.log("reached here");
        if(error){
            return next(error);
        }
        
        let accessToken;
        let refreshToken;
        try{         
            const user = await User.findOne({email:req.body.email});
            // console.log("reached here");
            if(!user){
                return next(CustomErrorHandler.WrongCredentials());
            }
            // Compare the password
            // console.log("reached here");
            const match = await bcrypt.compare(req.body.password,user.password);
            if(!match){
                return next(CustomErrorHandler.WrongCredentials());
            }

            // console.log("reached here");
            // Generate token

            accessToken = JwtService.sign({_id:user._id,role:user.role})
            refreshToken = JwtService.sign({_id:user._id,role:user.role},'1y',REF_TOKEN)
            await RefreshToken.create({token:refreshToken});

            res.json({accessToken,refreshToken});

        }
        catch{error}{
            return next(error);
        }

    },
    async logout(req,res,next){
        const refreshSchema = Joi.object({
            refreshToken:Joi.string().required()
        })

        const {error} = refreshSchema.validate(req.body);
        
        if(error){
            return next(error);
        }

        try{
            await RefreshToken.deleteOne({toekn:req.body.refreshToken});
            console.log("1");
        }
        catch(error){
            console.log("2");
            return next(new Error('Something Went Wrong in the database',error.message));
        }

        res.json({status:1});
    }
}

export default loginController;