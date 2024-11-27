import React, { useState } from 'react'
import { FaHotel, FaStore, FaWarehouse, FaPhone, FaRunning, FaTools, FaCar, FaHospital, FaBuilding, FaMotorcycle, FaIndustry, FaHardHat, FaBroom, FaUserShield } from "react-icons/fa";
import { Button } from './ui/button'
import { Search } from 'lucide-react'
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    const jobRoles = [
        { title: "Hotels & Restaurants", icon: <FaHotel size={50} /> },
        { title: "Retail Staff", icon: <FaStore size={50} /> },
        { title: "Warehouse Staff", icon: <FaWarehouse size={50} /> },
        { title: "Telecaller", icon: <FaPhone size={50} /> },
        { title: "Field Sales", icon: <FaRunning size={50} /> },
        { title: "Trades Person", icon: <FaTools size={50} /> },
        { title: "Driver", icon: <FaCar size={50} /> },
        { title: "Hospital Staff", icon: <FaHospital size={50} /> },
        { title: "Office Staff", icon: <FaBuilding size={50} /> },
        { title: "Delivery", icon: <FaMotorcycle size={50} /> },
        { title: "Factory & Mining", icon: <FaIndustry size={50} /> },
        { title: "Construction Workers", icon: <FaHardHat size={50} /> },
        { title: "House Help", icon: <FaBroom size={50} /> },
        { title: "Security Staff", icon: <FaUserShield size={50} /> },
    ];

    const LogoToText = (title) => {
        // console.log(jobRoles[index].title);
        console.log(title)
        setQuery(title);

    }

    return (
        <div className='text-center'>
            <div className='flex flex-col gap-5 my-10'>
                <span className=' mx-auto px-4 py-2 rounded-full bg-gray-100 text-[#F83002] font-medium'>No. 1 Job Hunt Website</span>
                <h1 className='text-5xl font-bold'>Search, Apply & <br /> Get Your <span className='text-[#6A38C2]'>Dream Jobs</span></h1>
{/*                 <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid aspernatur temporibus nihil tempora dolor!</p> */}
                <div className='flex w-[40%] shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-4 mx-auto'>
                    <input
                        type="text"
                        placeholder='Find your dream jobs'
                        onChange={(e) => setQuery(e.target.value)}
                        value={query}
                        className='outline-none border-none w-full'

                    />
                    <Button onClick={searchJobHandler} className="rounded-r-full bg-[#6A38C2]">
                        <Search className='h-5 w-5' />
                    </Button>
                </div>

                {/* <div className='flex justify-center gap-4'>
                    <Button className="rounded-full bg-green-500 text-white">
                        <span className='text-sm'>Hire Now</span>
                    </Button>
                    <Button className="rounded-full bg-gray-400 text-gray-800">
                        <span className='text-sm'>Learn More</span>
                    </Button>
                </div> */}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-6xl mx-auto mt-10">
                    {jobRoles.map((role, index) => (
                        <div key={index}>
                            <div onClick={()=>LogoToText(role.title)} className="cursor-pointer flex flex-col items-center text-blue-600">
                                {role.icon}
                                <h3 className="text-lg font-medium mt-2">{role.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>




            </div>

        </div>
    )
}

export default HeroSection
