import mongoose from "mongoose"

const subjectchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
   
    units: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Unit' 
        }
    ],

    user: {
         type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
     }
    
},{timestamps:true})

const Subject = mongoose.model('Subject', subjectchema)