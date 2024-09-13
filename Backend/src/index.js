import dotenv from "dotenv"
import connnectDB from "./db/index.js";
import { app } from "./app.js";
import cors from 'cors'

app.use(cors);
dotenv.config()

connnectDB()
.then(()=>{
    app.on("error",(error)=>{
        console.log("ERROR: ",error );
        throw error
    })
})
.then(()=>{
    const port=process.env.PORT || 8000
    app.listen(port,()=>{
        console.log(`Server is running at port: ${port}`);
        
    })
})
.catch((error)=>{
    console.log("Mongo db connection fail");    
})