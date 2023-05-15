import DashboardLayout from '@/components/dashboardLayout/DashboardLayout'
import React, { useEffect } from 'react'
import moment from "moment"
import { AiOutlineEye } from "react-icons/ai"
import { HiOutlineBriefcase } from "react-icons/hi"
import { TfiLocationPin } from "react-icons/tfi"
import Image from 'next/image'
import { useAppSelector } from '@/hooks/useAppSelector'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { getAppliedJobs } from '@/slices/job/jobSlice'

const index = () => {
    const auth = useAppSelector(state => state.authentication.data);
    const appliedJobs = useAppSelector(state => state.job.appliedJobs)

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (auth.token) {
            dispatch(getAppliedJobs({ token: auth.token }))
        }
    }, [auth.token])

    return (
        <DashboardLayout>
            <div className='w-full'>
                <h1 className='font-medium text-3xl '>Applied jobs</h1>
                <div className="bg-white rounded-lg mt-8 shadow-[0_6px_15px_rgba(64,79,104,.05)]   p-5">
                    <table className='w-full'>
                        <thead className=' bg-gray-100 text-blue-400'>
                            <tr >
                                <th className='py-3 font-medium  text-left pl-4 '>Job</th>
                                <th className='py-3 font-medium '>Date applied</th>
                                <th className='py-3 font-medium '>Status</th>
                                <th className='py-3 font-medium '>Action</th>
                            </tr>
                        </thead>
                        <tbody className='mt-3'>
                            {appliedJobs.data.map(item => {
                                return <tr>
                                    <td className='py-4 px-2 flex gap-4 items-start' >
                                        <Image alt="company logo" width={50} height={50} src="https://superio-next.vercel.app/images/resource/company-logo/1-1.png" />
                                        <div>
                                            <h3 className='font-medium text-lg' >{item.job_title}</h3>
                                            <div className='flex gap-4 items-center '>
                                                <div className='flex gap-3 items-center font-light  text-gray-500'>
                                                    <HiOutlineBriefcase />
                                                    <p>{item.job_industry}</p>
                                                </div>
                                                <div className='flex gap-3 items-center font-light text-gray-500'>
                                                    <TfiLocationPin />
                                                    <p>{item.location}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='py-4 px-2 text-center '>{moment(item.applied_at).format("LL")}</td>
                                    <td className='py-4 px-2 text-center'>{item.status}</td>
                                    <td className='py-4 px-2 flex '>
                                        <div className='mx-auto max-w-max  p-2 bg-blue-500 text-white rounded-full hover:shadow-md cursor-pointer '>
                                            <AiOutlineEye />
                                        </div>
                                    </td>
                                </tr>
                            })}


                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    )
}

export default index