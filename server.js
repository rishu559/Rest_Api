
import  express from "express";
import {APP_PORT, DB_URL} from './config';
import routes from "./routes";
import errorHandler from "./middlewares/errorHandler";
import mongoose from "mongoose";

// const APP_PORT = 3000;

// Database Connectionq
// mongoose.set("strictQuery", true);
mongoose
  .connect(DB_URL)
  .then(() => console.log("DB connected successfully..."))
  .catch((err) => console.log(err));


const app = express();
app.use(express.json());
app.use('/api',routes);


app.use(errorHandler);

app.listen(APP_PORT,()=>{
    console.log(`Server is running on port ${APP_PORT}`);
});