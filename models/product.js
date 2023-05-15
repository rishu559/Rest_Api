import mongoose from "mongoose";
import {APP_URL} from "../config"
const Schema = mongoose.Schema;

const productSchema = new Schema({
    
    id:{type:String,required:true,unique:true},
    name:{type:String,required:true},
    price:{type:Number,required:true},
    size:{type:String,required:true},
    image:{type:String,required:true,get:(image)=>{
        return `${APP_URL}/${image}`;
    }}
},{timestamps:true,toJSON:{getters:true}});

export default mongoose.model('Product', productSchema ,'Products');