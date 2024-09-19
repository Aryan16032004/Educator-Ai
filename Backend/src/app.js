import express from "express"

import cookieParser from "cookie-parser"

const app = express();



app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(cookieParser())


// routes

import userRouter from "./Router/user.route.js"
import subjectRoutes from "./Router/subgetter.route.js"


//  // routes declaration
app.use("/api/v1/users", userRouter)
app.use('/api/v1/subjects', subjectRoutes);

export { app }