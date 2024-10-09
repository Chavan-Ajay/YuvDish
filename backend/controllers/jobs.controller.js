import { Jobs } from "../models/jobs.model.js";
import { jobSeeker } from "../models/jobSeeker.model.js";
import { recruiter } from "../models/recruiter.model.js";

// admin post krega job
export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position } = req.body;
        const userId = req.id;

        const data = await recruiter.findById(userId).then(data => {
            try { return data._id }
            catch { return false; }
        });

        if (data && !jobSeeker.findById(userId)._id) {
            if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position) {
                return res.status(400).json({
                    message: "Somethin is missing.",
                    success: false
                })
            };
            const job = await Jobs.create({
                title,
                description,
                requirements: requirements.split(","),
                salary: Number(salary),
                location,
                jobType,
                experienceLevel: experience,
                position,
                created_by: userId
            });
            return res.status(201).json({
                message: "New job created successfully.",
                job,
                success: true
            });
        }
        return res.status(403).json({
            data: data,
            message: "You are not authorized to create a job.",
            success: false
        })
    } catch (error) {
        console.log("Error at post job by recruiter" + error);
    }
}


export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        };
        const jobs = await Jobs.find(query).populate({
            path: "created_by"
        }).sort({ createdAt: -1 });

        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log("Error at  getAllJob by recruiter" + error);
    }
}

// student
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Jobs.findById(jobId).populate({
            path: "jobSeekerId"
        });

        if (!job) {
            return res.status(404).json({
                message: "Jobs not found with this id.",
                success: false
            })
        };

        return res.status(200).json(
            { job, success: true }
        );
    } catch (error) {
        console.log("Error at  getJobById by recruiter" + error);
    }
}

// admin kitne job create kra hai abhi tk
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Jobs.find({ created_by: adminId }).populate({
            path: 'created_by',
            createdAt: -1
        });

        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };

        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log("Error at  getJobById by recruiter" + error);
    }
}

export const applyJobs = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;

        const Sdata = await jobSeeker.find({ appliedJobs: jobId }).then(data => {
            try { return data._id }
            catch { return false; }
        });
        const Jdata = await Jobs.find({ jobSeekerId: userId }).then(data => {
            try { return data._id }
            catch { return false; }
        });

        const Udata = await jobSeeker.findById(userId).then(data => {
            try { return data._id == userId }
            catch { return false; }
        });

        // console.log("userId : "+userId)
        // console.log("jobSeeker.find({ appliedJobs: jobId }) : "+Sdata)
        // console.log("Jobs.find({ jobSeekerId: userId }) : "+Jdata)
        // console.log("jobSeeker.findById(userId).then(data => { return data._id == userId }) : "+Udata)
        // // !Sdata && !Sdata
        // console.log(!Sdata && !Jdata && !Udata)

        if (!Sdata && !Jdata && Udata) {
            const user = await jobSeeker.findByIdAndUpdate(
                userId,
                { $push: { appliedJobs: jobId } },
                { new: true }
            ).populate({
                path: 'appliedJobs',
                createdAt: -1
            });

            if (!user) {
                return res.status(404).json({
                    message: "User not found.",
                    success: false
                })
            };

            const job = await Jobs.findByIdAndUpdate(
                jobId,
                { $push: { jobSeekerId: userId } },
                { new: true }
            ).populate({
                path: 'jobSeekerId',
                createdAt: -1
            });

            if (!job) {
                return res.status(404).json({
                    message: "Jobs not found.",
                    success: false
                })
            };
            return res.status(200).json({
                message: "Successfully applied for the job.",
                user,
                job,
                success: true
            })
        }
        return res.status(200).json({
            message: "applied ",
            success: true
        })


        

    } catch (error) {
        console.log("Error at  applyJobs by jobSeeker" + error);
    }
}
export const deleteAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobId = req.params.id;

        const job = await Jobs.findOne({ _id: jobId, created_by: adminId }).then(data => {
            try { return data._id == jobId }
            catch { return false; }
        });

        if (job) {
            const job = await Jobs.findByIdAndDelete(jobId);
            const user = await jobSeeker.findOne({ appliedJobs: job._id });
            if (user) {
                await jobSeeker.findByIdAndUpdate(user._id, { $pull: { appliedJobs: job._id } });
            }

            return res.status(200).json({
                message: "Successfully deleted the job.",
                job,
                success: true
            })
        }
        else{
            return res.status(200).json({
                message: "You are not allowed",
                job,
                success: true
            })
        }
    } catch (error) {
        console.log("Error at  getJobById by recruiter" + error);
    }
}
