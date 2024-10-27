import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";


import jobSeekerRoute from "./routes/jobSeeker.route.js";
import recruiterRoute from './routes/recruiter.route.js'
import jobsRoute from './routes/jobs.route.js'

dotenv.config({});

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOptions = {
    // origin: 'http://localhost:5173',
    origin:true,
    credentials: true
}

app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;


// api's
app.use("/api/v1/jobSeeker", jobSeekerRoute);
app.use("/api/v1/recruiter", recruiterRoute);
app.use("/api/v1/jobs", jobsRoute);


app.get('/', function (req, res) {
    res.send("<h1>Server Working</h1>")
});

app.listen(PORT, () => {
    connectDB();
    console.log(`Server running at port ${PORT}`);
})
