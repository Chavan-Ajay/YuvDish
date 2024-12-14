import express from "express";
import { login, logout, register, updateProfile, getImage, getGst } from "../controllers/recruiter.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/mutler.js";
 
const router = express.Router();

router.route("/register").post(singleUpload,register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post(isAuthenticated,singleUpload,updateProfile);
router.route("/image/:bId").get(getImage);
router.route("/gst/:no").get(getGst);

export default router;

