import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getAdminJobs, getAllJobs, getJobById, postJob,applyJobs, deleteAdminJobs, appliedJobsByJobSeeker,statusUp } from "../controllers/jobs.controller.js";

const router = express.Router();

router.route("/get").get(getAllJobs);
router.route("/apply/:id").get(isAuthenticated, applyJobs);
router.route("/post").post(isAuthenticated, postJob);
router.route("/delete/:id").get(isAuthenticated, deleteAdminJobs);

router.route("/appliedjob").get(isAuthenticated, appliedJobsByJobSeeker);
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);
router.route("/get/:id").get( getJobById);
router.route("/status/:id").post(isAuthenticated, statusUp);

export default router;

