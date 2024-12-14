import { recruiter } from "../models/recruiter.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

import axios from 'axios'

import fs from 'fs';
import path from 'path';


export const register = async (req, res) => {
    try {
        const { cName, bId, password } = req.body;

        if (!cName || !bId || !password) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        
            const file = req.file;
            const fileUri = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        
        
        const userChack = await recruiter.findOne({ bId });

        if (userChack) {
            return res.status(400).json({
                message: 'User already exist with this id.',
                success: false,
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);



        await recruiter.create({
            cName,
            bId,
            password: hashedPassword,
            profile: {
                profilePhoto: cloudResponse.secure_url,
            }
        });

        let newUser = await recruiter.findOne({ bId });

        const tokenData = {
            userId: newUser._id
        }

        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        const user = {
            _id: newUser._id,
            cName: newUser.cName,
            bId: newUser.bId,
            // phoneNumber: newUser.phoneNumber,
            profile: newUser.profile
        }

        return res.status(200).cookie("token", token, {
            maxAge: 1 * 24 * 60 * 60 * 1000,
            httpsOnly: true,
            sameSite: 'none',                 // Allow cross-site requests to include the cookie
            secure: true
        })
            .json({
                message: `Welcome ${newUser.cName}`,
                user,
                success: true
            })

    } catch (error) {
        console.log("Error at /register for recruiter" + error);
    }
}

export const login = async (req, res) => {
    try {
        const { bId, password } = req.body;

        if (!bId || !password) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        let user = await recruiter.findOne({ bId });

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

        const data = {
            _id: user._id,
            cName: user.cName,
            bId: user.bId,
            // phoneNumber: newUser.phoneNumber,
            profile: user.profile
        }

        return res.status(200).cookie("token", token, {
            maxAge: 1 * 24 * 60 * 60 * 1000,
            httpsOnly: true,
            sameSite: 'none',                 // Allow cross-site requests to include the cookie
            secure: true
        }).json({
            message: `Welcome back ${user.cName}`,
            data,
            success: true
        })
    } catch (error) {
        console.log("Error at /login for recruiter" + error);
    }
}

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log("Error at /logout for recruiter" + error);
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { cName, bId, phoneNumber, bio, skills } = req.body;

        let skillsArray;
        if (skills) {
            skillsArray = skills.split(",");
        }

        const userId = req.id; // middleware authentication
        let user = await recruiter.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            })
        }
        // updating data
        if (cName) user.cName = cName
        if (bId) user.bId = bId
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
            cName: user.cName,
            bId: user.bId,
            // phoneNumber: user.phoneNumber,
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


export const getImage = async (req, res) => {
    try {
        const bId = req.params.bId;

        let user = await recruiter.findById(bId);

        if (!user) {
            return res.status(400).json({
                message: "image not found",
                success: false
            })
        }
        

      
           const image = user.profile?.profilePhoto
    

        return res.status(200).json({
            message: "image found",
            image,
            success: true
        })
    } catch (error) {
        console.log("Error at /getImage for jobSeeker" + error);
    }
}


export const getGst = async (req, res) => {
    try {
        const no = req.params.no;

        const response = await axios.get('http://sheet.gstincheck.co.in/check/c8454aa665fedd68572898fd8ae4a430/' + no)
    

        return res.status(200).json({
            message: "data found",
            data: response.data,
            success: true
        })
    } catch (error) {
        console.log("Error at /getGST for rec" + error);
    }
}
