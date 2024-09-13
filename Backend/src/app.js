import express from "express"
import cors from "cors"


const app=express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))


 // routes

import userRouter from "./Router/user.route.js"


//  // routes declaration
 app.use("/api/v1/users",userRouter)

export {app}