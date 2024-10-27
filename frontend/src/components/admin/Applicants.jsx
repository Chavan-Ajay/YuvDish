import React, { useEffect } from 'react'
import Navbar from '../shared/Navbar'
import ApplicantsTable from './ApplicantsTable'
import axios from 'axios';
import { JOBS_API_END_POINT } from '@/utils/constant';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAllApplicants } from '@/redux/applicationSlice';

const Applicants = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const {applicants} = useSelector(store=>store.application);

    useEffect(() => {
        const fetchAllApplicants = async () => {
            try {
                const res = await axios.get(`${JOBS_API_END_POINT}/get/${params.id}`, { withCredentials: true });
                

                const allApplicants = [
                    ...(Array.isArray(res.data.job?.jobSeekerId) ? res.data.job.jobSeekerId : []),
                    ...(Array.isArray(res.data.job?.accepted) ? res.data.job.accepted : []),
                    ...(Array.isArray(res.data.job?.rejected) ? res.data.job.rejected : [])
                ];
                
                
                dispatch(setAllApplicants(allApplicants));
                
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllApplicants();
    }, []);
    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto'>
                <h1 className='font-bold text-xl my-5'>Applicants {applicants?.length}</h1>
                <ApplicantsTable />
            </div>
        </div>
    )
}

export default Applicants