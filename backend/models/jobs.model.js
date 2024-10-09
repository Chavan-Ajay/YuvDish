import mongoose from "mongoose";

const jobsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    requirements: [{
        type: String
    }],
    salary: {
        type: Number,
        required: true
    },
    experienceLevel: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true
    },
    jobType: {
        type: String,
        required: true
    },
    position: {
        type: Number,
        required: true
    },
    // company: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'recruiter',
    //     required: true
    // },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'recruiter',
        required: true
    },
    jobSeekerId: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'jobSeeker',
        }
    ]
}, { timestamps: true });
export const Jobs = mongoose.model("Jobs", jobsSchema);