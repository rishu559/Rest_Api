class CustomErrorHandler extends Error{
    constructor(statusCode,msg){
        super()
        this.statusCode = statusCode;
        this.message = msg;
    }

    static alreadyExist(message){
        return new CustomErrorHandler(409,message);
    }

    static WrongCredentials(message='username or password is wrong'){
        console.log("enter in wrong cred error");
        return new CustomErrorHandler(401,message);
    }

    static unAuthorized(message="Unauthorized"){
        return new CustomErrorHandler(401,message);
    }

    static notFound(message="404 Not Found"){
        return new CustomErrorHandler(404,message);
    }

    static serverError(message="Internal Server Error"){
        return new CustomErrorHandler(500,message);
    }

    static duplicateError(message="Can not add duplicate data"){
        return new CustomErrorHandler(409,message);
    }


}

export default CustomErrorHandler;