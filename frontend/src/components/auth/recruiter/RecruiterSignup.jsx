import React, { useEffect, useState } from 'react'
import Navbar from '../../shared/Navbar'
import { Label } from '../../ui/label'
import { Input } from '../../ui/input'
import { RadioGroup } from '../../ui/radio-group'
import { Button } from '../../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Recruiter_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setUser } from '@/redux/authSlice'
import { Loader2 } from 'lucide-react'

import fs from 'fs';
import path from 'path';

const RecruiterSignup = () => {

    const [popup, setPopup] = useState(false)
    const [data, setGstData] = useState()

    const [input, setInput] = useState({
        cName: "",
        bId: "",
        password: "",
        file: ""
    });
    const { loading, user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }
    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] });
    }
    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();    //formdata object
        formData.append("cName", input.cName);
        formData.append("bId", input.bId);
        formData.append("password", input.password);
        if (input.file) {
            formData.append("file", input.file);
        }
        // else {
        //     // Path to your default image
        //     const defaultImagePath = path.join(__dirname, 'image.png'); // Adjust the path as needed

        //     // Read the default image file
        //     const defaultImageStream = fs.createReadStream(defaultImagePath);
        //     formData.append("file", defaultImageStream, { filename: 'image.png' }); // Append the default image
        // }

        // console.log(formData.file)


        // Regex for Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // Regex for GSTIN (15 characters, alphanumeric with specific pattern)
        const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}[Z]{1}[A-Z0-9]{1}$/;

        if (gstRegex.test(input.bId)) {
            try {
                console.log(input.bId);
                
                const response = await axios.get('http://sheet.gstincheck.co.in/check/1998d0eafcbf6161f2614833048ea2a5/' + input.bId)
                console.log(response.data);
                
                setGstData(response.data)
                setPopup(true)
            } catch (error) {
                toast.error("Invalid GSTIN number.");
            }
            

        }
        else if (emailRegex.test(input.bId)) {
            try {
                dispatch(setLoading(true));
                const res = await axios.post(`${Recruiter_API_END_POINT}/register`, formData, {
                    headers: { 'Content-Type': "multipart/form-data" },
                    withCredentials: true,
                });

                if (res.data.success) {
                    dispatch(setUser(res.data.user));
                    navigate("/");
                    toast.success(res.data.message);
                } else {
                    toast.error(res.data.message);
                }
            } catch (error) {
                const message = error.response ? error.response.data.message : "An unexpected error occurred.";
                toast.error(message);
                // toast.error(error.response.data.message);
                console.log(error);
            } finally {
                dispatch(setLoading(false));
            }
        }
        else {
            toast.error("Invalid Email id or GSTIN no.");
        }

    }

    const gstinHandler = async () => {
        const formData = new FormData();    //formdata object
        formData.append("cName", input.cName);
        formData.append("bId", input.bId);
        formData.append("password", input.password);
        if (input.file) {
            formData.append("file", input.file);
        }
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${Recruiter_API_END_POINT}/register`, formData, {
                headers: { 'Content-Type': "multipart/form-data" },
                withCredentials: true,
            });

            if (res.data.success) {
                dispatch(setUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            const message = error.response ? error.response.data.message : "An unexpected error occurred.";
            toast.error(message);
            // toast.error(error.response.data.message);
            console.log(error);
        } finally {
            dispatch(setLoading(false));
        }

    }

    // const data = {
    //     flag: true,
    //     message: "GSTIN found.",
    //     data: {
    //         ntcrbs: "MFT",
    //         adhrVFlag: "Yes",
    //         lgnm: "SREEDHARA TEXTILES PRIVATE LIMITED",
    //         stj: "State - Tamil Nadu, Division - COIMBATORE, Zone - Coimbatore-I, Circle - AVANASHI ROAD",
    //         dty: "Regular",
    //         cxdt: "",
    //         gstin: "33ABBCS1600H1ZY",
    //         nba: [
    //             "Factory / Manufacturing",
    //             "Export",
    //             "Others",
    //             "Bonded Warehouse",
    //         ],
    //         ekycVFlag: "Not Applicable",
    //         cmpRt: "NA",
    //         rgdt: "06/12/2018",
    //         ctb: "Private Limited Company",
    //         pradr: {
    //             adr: "3RD FLOOR, NO 707, Suguna building, Avinashi road, Coimbatore, Coimbatore, Tamil Nadu, 641018",
    //         },
    //         sts: "Active",
    //         tradeNam: "SREEDHARA TEXTILES PRIVATE LIMITED",
    //         isFieldVisitConducted: "No",
    //         adhrVdt: "15/03/2024",
    //         ctj: "State - CBIC, Zone - CHENNAI, Commissionerate - COIMBATORE, Division - COIMBATORE - III, Range - COIMBATORE - IIIB (Jurisdictional Office)",
    //         einvoiceStatus: "Yes",
    //     },
    // };

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [])
    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center max-w-7xl mx-auto'>
                <form onSubmit={submitHandler} className='w-1/2 border border-gray-200 rounded-md p-4 my-10'>
                    <h1 className='font-bold text-xl mb-5'>Sign Up</h1>
                    <div className='my-2'>
                        <Label>Company Name</Label>
                        <Input
                            type="text"
                            value={input.cName}
                            name="cName"
                            onChange={changeEventHandler}
                            placeholder="Enter Company name"
                            required
                        />
                    </div>
                    <div className='my-2'>
                        <Label>Email or GSTIN</Label>
                        <Input
                            type="text"
                            value={input.bId}
                            name="bId"
                            onChange={changeEventHandler}
                            placeholder="Enter Email or GST or FSSAI"
                            required
                        />
                    </div>
                    <div className='my-2'>
                        <Label>Password</Label>
                        <Input
                            type="password"
                            value={input.password}
                            name="password"
                            onChange={changeEventHandler}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                            <Label>Profile Photo</Label>
                            <Input
                                accept="image/*"
                                type="file"
                                onChange={changeFileHandler}
                                className="cursor-pointer"
                                required
                            />
                        </div>
                    </div>
                    {
                        loading ? <Button className="w-full my-4"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> : <Button type="submit" className="w-full my-4">Signup</Button>
                    }
                    <span className='text-sm'>Already have an account? <Link to="/recruiter/login" className='text-blue-600'>Login</Link></span>
                </form>

                {popup && data?.data && (
                    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
                        {/* Background Overlay */}
                        <div
                            className="absolute top-0 left-0 w-full h-full bg-black opacity-50"
                            onClick={() => setPopup(false)}
                        ></div>

                        {/* Popup Content */}
                        <div className="relative bg-white p-6 rounded shadow-lg max-w-lg w-full z-60">
                            <h2 className="text-lg font-bold mb-4">GSTIN Details</h2>
                            <p>
                                <strong>GSTIN:</strong> {data.data.gstin}
                            </p>
                            <p>
                                <strong>Legal Name:</strong> {data.data.lgnm}
                            </p>
                            <p>
                                <strong>State Jurisdiction:</strong> {data.data.stj}
                            </p>
                            <p>
                                <strong>Address:</strong> {data.data.pradr.adr}
                            </p>
                            <p>
                                <strong>Nature of Business:</strong>{" "}
                                {data.data.nba.join(", ")}
                            </p>
                            <p>
                                <strong>Status:</strong> {data.data.sts}
                            </p>
                            <p>
                                <strong>Registered Date:</strong> {data.data.rgdt}
                            </p>

                            <div className="flex justify-end mt-4">
                                <button
                                    className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
                                    onClick={() => setPopup(false)}
                                >
                                    Close
                                </button>
                                <button
                                    className="bg-green-500 text-white px-4 py-2 rounded"
                                    onClick={gstinHandler}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}

export default RecruiterSignup
