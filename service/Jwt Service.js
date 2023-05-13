
import { JWT_SECRET } from "../config";
import jwt from "jsonwebtoken";
// import { Jwt } from "jsonwebtoken";

class JwtService{

    static sign(payload,expiry='1y',secret=JWT_SECRET){
        return jwt.sign(payload,secret,{expiresIn:expiry});
    }
    
    static verify(token,secret=JWT_SECRET){

        let result = jwt.verify(token,secret);
 
        return result;
    }
}
export default JwtService;