import mongoose from "mongoose";

const recruiterSchema = new mongoose.Schema({
    cName: {
        type: String,
        required: true
    },
    bId: {
        type: String,
        required: true,
        unique: true
        // ---------------------------------------
    },
    phoneNumber: {
        type: Number,
        // required: true
    },
    password:{
        type:String,
        required:true,
        // ---------------------------------------
    },
    profile:{
        bio:{type:String},
        skills:[{type:String}],
        resume:{type:String}, // URL to resume file
        resumeOriginalName:{type:String},
        profilePhoto:{
            type:String,
            default:""
        }
    },
},{timestamps:true});
export const recruiter = mongoose.model('recruiter', recruiterSchema);