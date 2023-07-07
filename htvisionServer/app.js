import express from "express"
import {config} from "dotenv";
import ErrorMiddleware from "./middlewares/Error.js"
import cookieParser from "cookie-parser";
import cors from "cors";

config({
    path: "./config/config.env",
});
const app = express();

//using Middlewares
app.use(express.json());

app.use(
    express.urlencoded({
        extended: true,
        })
    );

app.use(cookieParser());  
  
//for heroku
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true,
    methods:["GET","POST","PUT","DELETE"]
})
);

import user from "./routes/userRoutes.js";

app.use("/api/v1", user);


export default app;
//for heroku 
app.get("/",(req,res)=>res.send(`<h1>Site is working. click <a href=${process.env.FRONTEND_URL}>here</a> to visit frontend</h1>`))

app.use(ErrorMiddleware)