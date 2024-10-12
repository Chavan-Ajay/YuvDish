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
                        <Label>Email or GST or FSSAI</Label>
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
            </div>
        </div>
    )
}

export default RecruiterSignup