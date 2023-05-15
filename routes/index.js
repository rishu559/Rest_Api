import express from 'express'
import {registerController} from '../controllers';
import loginController from '../controllers/auth/loginController';
import userController from '../controllers/auth/userController';
import refreshController from '../controllers/auth/refreshController';
import productController from '../controllers/products/productController';
import admin from '../middlewares/admin';


import auth from "../middlewares/auth";

const router = express.Router();

router.post('/register',registerController.register);
router.post('/login',loginController.login);
router.get('/me',auth,userController.me);
router.post('/refresh',refreshController.refresh);
router.post('/logout',auth,loginController.logout);


router.post('/products',[auth,admin],productController.store);
router.put('/products/:id',[auth,admin],productController.update);
router.delete('/products/:id',[auth,admin],productController.deleteProduct);
router.get('/products',productController.getAllProducts);
router.get('/products/:id',productController.getSingleProduct);
// router.post('/products',productController.store);


export default router;