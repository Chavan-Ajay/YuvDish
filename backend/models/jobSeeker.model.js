import mongoose from "mongoose";

const jobSeekerSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    password:{
        type:String,
        required:true,
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
    appliedJobs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Jobs',
        }
    ]
},{timestamps:true});
export const jobSeeker = mongoose.model('jobSeeker', jobSeekerSchema);