import React, { useEffect, useState } from 'react';
import Navbar from './shared/Navbar';
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import Footer from './shared/Footer';
import { Button } from './ui/button';
import { Search } from 'lucide-react';
import { Range } from 'react-range';  // Importing react-range for dual-handle slider
import { motion } from 'framer-motion';

const STEP = 1000;   // Step value for the salary range
const MIN = 0;       // Minimum value for the slider
const MAX = 200000;  // Maximum value for the slider

const Browse = () => {
    const [query, setQuery] = useState("");
    const [location, setLocation] = useState("");  // Location filter
    const [salaryRange, setSalaryRange] = useState([0, 100000]);  // Salary range filter (combined)
    const [filteredJobs, setFilteredJobs] = useState([]);

    const dispatch = useDispatch();
    useGetAllJobs();

    const { allJobs } = useSelector(store => store.job);

    // Handle search functionality
    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query));  // Optionally store the query in Redux
        filterJobs();  // Apply filters when the search button is clicked
    };

    // Filter jobs based on query, location, and salary
    const filterJobs = () => {
        let filtered = allJobs;

        // Filter by search query
        if (query.trim()) {
            const lowercasedQuery = query.toLowerCase();
            filtered = filtered.filter(job =>
                job.title.toLowerCase().includes(lowercasedQuery) ||
                job.description.toLowerCase().includes(lowercasedQuery)
            );
        }

        // Filter by location
        if (location.trim()) {
            filtered = filtered.filter(job =>
                job.location.toLowerCase().includes(location.toLowerCase())
            );
        }

        // Filter by salary range
        filtered = filtered.filter(job =>
            job.salary >= salaryRange[0] && job.salary <= salaryRange[1]
        );

        setFilteredJobs(filtered);
    };

    // Apply filters whenever the inputs change
    useEffect(() => {
        filterJobs();
    }, [query, location, salaryRange, allJobs]);

    // Clear search query when component unmounts
    useEffect(() => {
        return () => {
            dispatch(setSearchedQuery(""));  // Clear query on unmount
        };
    }, [dispatch]);

    return (
        <div>
            <Navbar />
            <div className='flex flex-col gap-4'>
                {/* Search Input */}
                <div className='flex w-[80%] md:w-[40%] shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-4 mx-auto'>
                    <input
                        type="text"
                        placeholder='Find your dream jobs'
                        onChange={(e) => setQuery(e.target.value)}
                        value={query}
                        className='outline-none border-none w-full py-2 px-3'
                    />
                    <Button onClick={searchJobHandler} className="rounded-r-full bg-[#6A38C2]">
                        <Search className='h-5 w-5' />
                    </Button>
                </div>

                <div className='flex w-[80%] md:w-[70%] mx-auto justify-between items-center gap-4'>
                    {/* Location Filter */}
                    <div className='flex flex-1 shadow-lg border border-gray-200 pl-3 pr-3 rounded-full items-center gap-4'>
                        <input
                            type="text"
                            placeholder='Location'
                            onChange={(e) => setLocation(e.target.value)}
                            value={location}
                            className='outline-none border-none w-full py-2 px-3'
                        />
                    </div>

                    {/* Combined Salary Range Slider */}
                    <div className='flex-1 flex flex-col shadow-lg border border-gray-200 pl-3 pr-3 rounded-full items-center gap-3'>
                        {/* <div className='flex  justify-between items-center '>
                            <span className='text-gray-700'>Salary Range:</span>
                            <span className='font-bold'>{`$${salaryRange[0]} - $${salaryRange[1]}`}</span>
                        </div> */}
                        <Range
                            step={STEP}
                            min={MIN}
                            max={MAX}
                            values={salaryRange}
                            onChange={(values) => setSalaryRange(values)}
                            renderTrack={({ props, children }) => (
                                <div
                                    {...props}
                                    className="h-2 bg-gray-300 rounded-full w-full"
                                >
                                    {children}
                                </div>
                            )}
                            renderThumb={({ props, index }) => (
                                <div
                                    {...props}
                                    className="h-7 w-11 bg-purple-600 rounded-full flex items-center justify-center"
                                >
                                    <span className="text-white text-xs">{salaryRange[index]}</span>
                                </div>
                            )}
                        />
                    </div>
                </div>

            </div>

            <div className='max-w-7xl mx-auto my-10'>
                <h1 className='font-bold text-xl my-10'>Search Results ({filteredJobs.length})</h1>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    {
                        filteredJobs.map((job) => (
                            <motion.div
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ duration: 0.3 }}
                                key={job?._id}>

                                <Job key={job._id} job={job} />

                            </motion.div>
                        ))
                    }
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Browse;
