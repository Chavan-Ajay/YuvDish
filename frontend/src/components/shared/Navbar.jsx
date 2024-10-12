import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage } from '../ui/avatar'
import { LogOut, User2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { JobSeeker_API_END_POINT, Recruiter_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'


const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            if (user?.bId) {
                const res = await axios.get(`${Recruiter_API_END_POINT}/logout`, { withCredentials: true });
                console.log("Recruiter_API_END_POINT");
                if (res.data.success) {
                    dispatch(setUser(null));
                    navigate("/");
                    toast.success(res.data.message);
                }
            }
            else if(user?.fullname){
                const res = await axios.get(`${JobSeeker_API_END_POINT}/logout`, { withCredentials: true });
                console.log("JobSeeker_API_END_POINT");
                if (res.data.success) {
                    dispatch(setUser(null));
                    navigate("/");
                    toast.success(res.data.message);
                }
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }
    return (
        <div className='bg-white'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-16'>
                <div >
                    {/* <h1 className='text-2xl font-bold'>Job<span className='text-[#F83002]'>Portal</span></h1> */}
                    <img className='w-1/5 ' src='/logo.png' />
                </div>
                <div className='flex items-center gap-12'>
                    <ul className='flex font-medium items-center gap-7'>
                        {
                            user?.bId ? (
                                <>
                                    {/* <li><Link to="/admin/companies">Companies</Link></li> */}
                                    <li><Link to="/">Home</Link></li>
                                    {/* <li><Link to="/jobs">Jobs</Link></li> */}
                                    <li><Link to="/browse">Browse</Link></li>
                                    <li><Link to="/admin/jobs">Post Jobs</Link></li>
                                </>
                            ) : (
                                <>
                                    <li><Link to="/">Home</Link></li>
                                    {/* <li><Link to="/jobs">Jobs</Link></li> */}
                                    <li><Link to="/browse">Browse</Link></li>
                                </>
                            )
                        }


                    </ul>
                    {
                        !user ? (
                            <div className='flex items-center gap-2'>
                                <Link to="/login"><Button variant="outline">Login</Button></Link>
                                <Link to="/signup"><Button className="bg-[#6A38C2] hover:bg-[#5b30a6]">Signup</Button></Link>
                            </div>
                        ) : (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Avatar className="cursor-pointer">
                                        <AvatarImage src={user?.profile?.profilePhoto ? user?.profile?.profilePhoto : "./image.png"} alt="@shadcn" />
                                    </Avatar>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <div className=''>
                                        <div className='flex gap-2 space-y-2'>
                                            <Avatar className="cursor-pointer">
                                                <AvatarImage src={user?.profile?.profilePhoto ? user?.profile?.profilePhoto : "./image.png"} alt="@shadcn" />
                                            </Avatar>
                                            <div>
                                                <h4 className='font-medium'>{user?.fullname ? user?.fullname : user?.cName}</h4>
                                                <p className='text-sm text-muted-foreground'>{user?.profile?.bio}</p>
                                            </div>
                                        </div>
                                        <div className='flex flex-col my-2 text-gray-600'>
                                            {
                                                user && user?.fullname && (
                                                    <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                                        <User2 />
                                                        <Button variant="link"> <Link to="/profile">View Profile</Link></Button>
                                                    </div>
                                                )
                                            }

                                            <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                                <LogOut />
                                                <Button onClick={logoutHandler} variant="link">Logout</Button>
                                            </div>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )
                    }

                </div>
            </div>

        </div>
    )
}

export default Navbar