import { setAllAppliedJobs } from "@/redux/jobSlice";
import { JOBS_API_END_POINT } from "@/utils/constant";
import axios from "axios"
import { useEffect } from "react"
import { useDispatch,useSelector } from "react-redux"


const useGetAppliedJobs = () => {
    const dispatch = useDispatch();
    const {user} = useSelector(store=>store.job);

    useEffect(()=>{
        const fetchAppliedJobs = async () => {
            try {
                const res = await axios.get(`${JOBS_API_END_POINT}/appliedJob`, {withCredentials:true});
                console.log(res.data.appliedJob);
                
                if(res.data.success){
                    dispatch(setAllAppliedJobs(res.data.appliedJobs.appliedJobs));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAppliedJobs();
    },[])
};
export default useGetAppliedJobs;