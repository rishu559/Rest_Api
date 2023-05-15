import Joi from 'joi'
import CustomErrorHandler from '../../service/CustomErrorHandler';
import User  from '../../models/User';
import bcrypt from 'bcrypt'
import JwtService from '../../service/Jwt Service';
import { REF_TOKEN } from '../../config';
import { RefreshToken } from '../../models';


const registerController = {
    register: async (req, res,next) => {
        // CHECKLIST
        // [] validate the request
        const registerSchema = Joi.object({
            name:Joi.string().min(3).max(30).required(),
            email:Joi.string().min(5).max(30).email(),
            password:Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
            repeat_password:Joi.ref('password')
        });

        const {error} = registerSchema.validate(req.body);

        if(error){
            return next(error);
        }

        // [] authorise the request
        // [] check if user alredy in database
        
        try{
            const exist = await User.exists({email:req.body.email});

            if(exist){
                return next(CustomErrorHandler.alreadyExist("Email already exists"));
            }
        }
        catch(error){
            return next(error);
        }

        // Hash Password
        const hashed = await bcrypt.hash(req.body.password,10);
        
        // [] prepare model
        const {name,email,password}=req.body;
        let user = new User({
            name:name,
            email:email,
            password:hashed
        });

        // [] store in database
        let accessToken;
        let refreshToken;
        try{
            const result = await user.save();
            console.log(result);

            // Generate token
            accessToken = JwtService.sign({_id:result._id,role:result.role})

            refreshToken = JwtService.sign({_id:result._id,role:result.role},'1y',REF_TOKEN)

            // database whitelist
            await RefreshToken.create({token:refreshToken});


        }
        catch(error){
            return next(error);
        }

        // [] generate jwt token


        // [] send response

        res.json({accessToken:accessToken,refreshToken:refreshToken});
    }
}

export default registerController;