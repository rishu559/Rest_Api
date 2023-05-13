import Joi from "joi";
import { User } from "../../models";
import CustomErrorHandler from "../../service/CustomErrorHandler";
import bcrypt from 'bcrypt';
import JwtService from "../../service/Jwt Service";

const loginController = {
    async login (req,res,next){

        // validation
        const loginSchema = Joi.object({
            email:Joi.string().min(5).max(30).email(),
            password:Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        })

        const {error} = loginSchema.validate(req.body);

        if(error){
            return next(error);
        }
        
        let accessToken;
        try{         
            const user = await User.findOne({email:req.body.email});
            console.log(user,req.body.password);

            if(!user){
                return next(CustomErrorHandler.WrongCredentials());
            }
            console.log("reached here");
            // Compare the password

            const match = await bcrypt.compare(req.body.password,user.password);
            if(!match){
                return next(CustomErrorHandler.WrongCredentials());
            }

            // Generate token

            accessToken = JwtService.sign({_id:user._id,role:user.role})

            res.json({accessToken});

        }
        catch{error}{
            return next(error);
        }

    }
}

export default loginController;