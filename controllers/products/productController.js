import { Product } from "../../models";
import multer from "multer";
import path from "path";
import CustomErrorHandler from "../../service/CustomErrorHandler";
import fs from "fs";
import Joi from "joi";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    console.log(req.body);
    const uniqueName =
      file.fieldname + "-" + Date.now() + "." + file.mimetype.split("/")[1];
    cb(null, uniqueName);
  },
});

// console.log(req.body);
const handleMultipartData = multer({
  storage,
  limits: { fileSize: 1000000 * 5 },
}).single("image");

const productController = {
  async store(req, res, next) {
    // multipart form data
    console.log(req.body);
    handleMultipartData(req, res, async (err) => {
      if (err) {
        return next(CustomErrorHandler.serverError(err.message));
      }

      console.log(req.body);
      console.log(req.file);
      const filePath = req.file.path;

      //validation
      const productSchema = Joi.object({
        id: Joi.string().required(),
        name: Joi.string().required(),
        price: Joi.number().required(),
        size: Joi.string().required(),
      });

      const errValidate = productSchema.validate(req.body).error;

      if (errValidate) {
        // Delete the uploaded image
        fs.unlink(`${appRoot}/${filePath}`, (err) => {
          if (err) {
            return next(CustomErrorHandler.serverError(err.message));
          }
        });
        return next(errValidate);
      }

      const { id, name, price, size } = req.body;
      let document;

      const found = await Product.findOne({ id: req.body.id });

      if (found) {
        return next(CustomErrorHandler.duplicateError());
      }
      try {
        document = await Product.create({
          id,
          name,
          price,
          size,
          image: filePath,
        });
      } catch (error) {
        return next(error);
      }
      const { name: cname, size: csize } = document._doc;
      res.status(201).json(document);
    });
  },
  async update(req, res, next) {
    handleMultipartData(req, res, async (err) => {
      if (err) {
        return next(CustomErrorHandler.serverError(err.message));
      }
      let filePath;

      if (req.file) {
        filePath = req.file.path;
      }

      //validation
      const productSchema = Joi.object({
        id: Joi.string(),
        name: Joi.string().required(),
        price: Joi.number().required(),
        size: Joi.string().required(),
        image: Joi.string(),
      });

      const errValidate = productSchema.validate(req.body).error;

      if (errValidate) {
        // Delete the uploaded image
        if (filePath) {
          fs.unlink(`${appRoot}/${filePath}`, (err) => {
            if (err) {
              return next(CustomErrorHandler.serverError(err.message));
            }
          });
        }
        return next(errValidate);
      }

      console.log("1");
      const { id, name, price, size } = req.body;
      let document;

      // const found = await Product.findOne({id:req.body.id});

      // if(found){
      //     return next(CustomErrorHandler.duplicateError());
      // }
      try {
        console.log("1");
        document = await Product.findOneAndUpdate(
          { id: req.params.id },
          {
            id: req.params.id,
            name,
            price,
            size,
            ...(req.file && { image: filePath }),
          },
          { new: true }
        );
        console.log(document);
      } catch (error) {
        return next(error);
      }
      const { name: cname, size: csize } = document._doc;
      res.status(201).json(document);
    });
  },
  async deleteProduct(req, res, next) {

    const document = await Product.findOneAndRemove({ id: req.params.id });
    if (!document) {
      return next(new Error("Nothing to delete"));
    }

    // image delete

    const imagePath = document._doc.image;
    console.log(imagePath);
    fs.unlink(`${appRoot}/${imagePath}`, (err) => {
      if (err) {
        return next(CustomErrorHandler.serverError(err.message));
      }
    });
    return res.json(document);
  },
  async getAllProducts(req,res,next){
    let document;

    // Pagination -mongoose-pagination
    try{
      document = await Product.find().select("-__v -updatedAt").sort({id:-1});

    }
    catch(error){
      return next(new Error("Server Error"));
    }
    return res.json(document);
  } 
  ,
  async getSingleProduct(req,res,next){
    let document;

    // Pagination -mongoose-pagination
    try{
      document = await Product.findOne({id:req.params.id}).select("-__v -updatedAt -_id");

    }
    catch(error){
      return next(new Error("Server Error"));
    }
    return res.json(document);
  }
};

export default productController;
