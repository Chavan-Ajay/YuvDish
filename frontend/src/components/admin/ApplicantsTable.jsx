import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { JOBS_API_END_POINT } from '@/utils/constant';
import axios from 'axios';

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application);

    const statusHandler = async (status, id) => {
        console.log('called');
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${JOBS_API_END_POINT}/status/${id}`, { status });
            console.log(res);
            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    return (
        <div>
            <Table>
                <TableCaption>A list of your recent applied user</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>FullName</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead>Date</TableHead>
                        {/* <TableHead>Status</TableHead> */}
                        {/* <TableHead className="text-right">Action</TableHead> */}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        applicants && applicants?.map((item) => (
                            <tr key={item._id}>
                                <TableCell>{item?.fullname}</TableCell>
                                <TableCell>{item?.email}</TableCell>
                                <TableCell>{item?.phoneNumber}</TableCell>
                                <TableCell >
                                    {
                                        item.profile?.resume ? <a className="text-blue-600 cursor-pointer" href={item?.profile?.resume} target="_blank" rel="noopener noreferrer">{item?.profile?.resumeOriginalName}</a> : <span>NA</span>
                                    }
                                </TableCell>
                                <TableCell>{item?.createdAt?.split("T")[0]}</TableCell>
                                
                                {/* <TableCell>
                                    {
                                        item.status
                                        // item.status?.toLowerCase() === "accepted" ? (
                                        //     <div>Accepted</div>
                                        // ) : item.status?.toLowerCase() === "rejected" ? (
                                        //     <div>Rejected</div>
                                        // ) : item.status?.toLowerCase() === "pending" ? (
                                        //     <div>Pending</div>
                                        // ) : (
                                        //     <div>Not Viewed</div>
                                        // )
                                    }
                                </TableCell> */}

                                {/* <TableCell className="float-right cursor-pointer">
                                    <Popover>
                                        <PopoverTrigger>
                                            <MoreHorizontal />
                                        </PopoverTrigger>
                                        <PopoverContent className="w-32">
                                            {
                                                shortlistingStatus.map((status, index) => {
                                                    return (
                                                        <div onClick={() => statusHandler(status, item._id)} key={index} className='flex w-fit items-center my-2 cursor-pointer'>
                                                            <span>{status}</span>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </PopoverContent>
                                    </Popover>

                                </TableCell> */}

                            </tr>
                        ))
                    }

                </TableBody>

            </Table>
        </div>
    )
}

export default ApplicantsTable