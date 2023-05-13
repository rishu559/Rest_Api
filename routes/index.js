import express from 'express'
import {registerController} from '../controllers';
import loginController from '../controllers/auth/loginController';

import userController from '../controllers/auth/userController';

import auth from "../middlewares/auth";

const router = express.Router();

router.post('/register',registerController.register);

router.post('/login',loginController.login);

router.get('/me',auth,userController.me);

export default router;