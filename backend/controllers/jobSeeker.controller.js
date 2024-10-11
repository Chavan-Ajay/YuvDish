import { jobSeeker } from "../models/jobSeeker.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password } = req.body;

        if (!fullname || !email || !phoneNumber || !password) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        const file = req.file;
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

        const userChack = await jobSeeker.findOne({ email });
        if (userChack) {
            return res.status(400).json({
                message: 'User already exist with this email.',
                success: false,
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await jobSeeker.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            profile: {
                profilePhoto: cloudResponse.secure_url,
            }
        });

        let newUser = await jobSeeker.findOne({ email });

        const tokenData = {
            userId: newUser._id
        }

        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        const user = {
            _id: newUser._id,
            fullname: newUser.fullname,
            email: newUser.email,
            phoneNumber: newUser.phoneNumber,
            profile: newUser.profile
        }

        res.cookie("token", token, {
            maxAge: 1 * 24 * 60 * 60 * 1000,
            httpsOnly: true,
            sameSite: 'none',
            secure: true,
        });
        
        return res.status(200).json({
            success: true,
            message: `Welcome ${newUser.fullname}`,
            user,
        });

    } catch (error) {
        console.log("Error at /register for jobSeeker" + error);
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        let user = await jobSeeker.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Incorrect email ",
                success: false,
            })
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect password.",
                success: false,
            })
        };

        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        let fuser = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            profile: user.profile
        }

        return res.status(200).cookie("token", token, {
            maxAge: 1 * 24 * 60 * 60 * 1000,
            httpsOnly: true,
            sameSite: 'none',                 // Allow cross-site requests to include the cookie
            secure: true
        })
            .json({
                message: `Welcome back ${user.fullname}`,
                fuser,
                success: true
            })
    } catch (error) {
        console.log("Error at /login for jobSeeker" + error);
    }
}

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log("Error at /logout for jobSeeker" + error);
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;


        let skillsArray;
        if (skills) {
            skillsArray = skills.split(",");
        }

        const userId = req.id; // middleware authentication
        let user = await jobSeeker.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            })
        }
        // updating data
        if (fullname) user.fullname = fullname
        if (email) user.email = email
        if (phoneNumber) user.phoneNumber = phoneNumber
        if (bio) user.profile.bio = bio
        if (skills) user.profile.skills = skillsArray

        if (req.file) {
            const file = req.file;
            // cloudinary ayega idhar
            const fileUri = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

            // resume comes later here...
            if (cloudResponse) {
                user.profile.resume = cloudResponse.secure_url // save the cloudinary url
                user.profile.resumeOriginalName = file.originalname // Save the original file name
            }
        }



        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            profile: user.profile
        }

        return res.status(200).json({
            message: "Profile updated successfully.",
            user,
            success: true
        })
    } catch (error) {
        console.log("Error at /updateProfile for jobSeeker" + error);
    }
}