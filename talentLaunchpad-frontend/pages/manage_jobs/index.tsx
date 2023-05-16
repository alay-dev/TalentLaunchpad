// @ts-nocheck
import DashboardLayout from '@/components/dashboardLayout/DashboardLayout'
import React, { useEffect, useState } from 'react'
import moment from "moment"
import { AiOutlineEye, AiOutlineDelete } from "react-icons/ai"
import { HiOutlineBriefcase } from "react-icons/hi"
import { TfiLocationPin } from "react-icons/tfi"
import { RiPencilLine } from "react-icons/ri"
import Image from 'next/image'
import { Modal } from '@mui/material'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useAppSelector } from '@/hooks/useAppSelector'
import { deleteJob, getUserJobs } from '@/slices/job/jobSlice'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { getUserCompany } from '@/slices/company/companySlice'
import UNIVERSAL from '@/config/config'

const ManageJob = () => {
    const [applicantModal, setApplicantModal] = useState<any>(false)
    const [deleteModal, setDeleteModal] = useState<any>(false);
    const [jobList, setJobList] = useState<string[]>([]);
    const auth = useAppSelector(state => state.authentication.data);
    const jobs = useAppSelector(state => state.job.userJob);
    const company = useAppSelector(state => state.company)


    const dispatch = useAppDispatch()

    const router = useRouter()

    useEffect(() => {
        if (auth?.token) {
            dispatch(getUserJobs({ token: auth.token }))
            dispatch(getUserCompany({ token: auth.token }))
        }
    }, [auth.token])

    const handle_edit_job = (data: any) => {
        return router.push(`/edit_job/${data?.job_id}`)
    }

    const handle_delete_job = (data: string) => {
        dispatch(deleteJob({ id: data, token: auth.token }))
            .unwrap()
            .then(() => {
                dispatch(getUserJobs({
                    token: auth.token
                }))

                setDeleteModal(false)
            })
    }


    useEffect(() => {
        let tmp = Object.keys(jobs.data)
        setJobList(tmp);
    }, [jobs.data])

    return (
        <DashboardLayout>
            <div className='w-full'>
                <h1 className='font-medium text-3xl '>Manage jobs</h1>
                <div className="bg-white rounded-lg mt-8 shadow-[0_6px_15px_rgba(64,79,104,.05)]   p-5">
                    <table className='w-full'>
                        <thead className=' bg-gray-100 text-blue-400'>
                            <tr >
                                <th className='py-3 font-medium  text-left pl-4 '>Job</th>
                                <th className='py-3 font-medium '>Applications</th>
                                <th className='py-3 font-medium '>Posted on</th>
                                <th className='py-3 font-medium '>Status</th>
                                <th className='py-3 font-medium '>Action</th>
                            </tr>
                        </thead>
                        <tbody className='mt-3'>
                            {jobList.map((item: string, i) => {
                                return <tr key={item}>
                                    <td className='py-4 px-2 flex gap-4 items-start' >
                                        <Image alt="company logo" width={50} height={50} src={`${UNIVERSAL.BASEURL}/company/${company.userCompany.data.company_logo}`} />
                                        <div>
                                            <h3 className='font-medium text-lg' >{item}</h3>
                                            <div className='flex gap-4 items-center '>
                                                <div className='flex gap-3 items-center font-light  text-gray-500'>
                                                    <HiOutlineBriefcase />
                                                    <p>{jobs.data[item][0].job_industry}</p>
                                                </div>
                                                <div className='flex gap-3 items-center font-light text-gray-500'>
                                                    <TfiLocationPin />
                                                    <p>{jobs.data[item][0].job_location}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td onClick={() => setApplicantModal(jobs.data[item])} className='py-4 px-2 text-center text-blue-600 underline cursor-pointer'>{jobs.data[item][0].applied_at ? jobs.data[item].length : "0"} application</td>
                                    <td className='py-4 px-2 text-center '>{moment(jobs.data[item][0].created_at).format("LL")}</td>
                                    <td className='py-4 px-2 text-center'>Active</td>
                                    <td className='py-4 px-2 flex justify-center'>
                                        <div onClick={() => router.push(`/job/${jobs.data[item][0].job_id}`)} className='mx-auto max-w-max  p-2 bg-gray-100 text-blue-500 rounded-full hover:shadow-md cursor-pointer '>
                                            <AiOutlineEye />
                                        </div>
                                        <div className='mx-auto max-w-max  p-2 bg-gray-100 text-blue-500 rounded-full hover:shadow-md cursor-pointer ' onClick={() => handle_edit_job(jobs.data[item][0])}>
                                            <RiPencilLine />
                                        </div>
                                        <div className='mx-auto max-w-max  p-2 bg-gray-100 text-blue-500 rounded-full hover:shadow-md cursor-pointer '>
                                            <AiOutlineDelete onClick={() => setDeleteModal(jobs.data[item][0])} />
                                        </div>
                                    </td>
                                </tr>
                            })}


                        </tbody>
                    </table>
                </div>
            </div>
            <Modal open={applicantModal} onClose={() => setApplicantModal(false)}  >
                <div className=" w-4/12 flex flex-col bg-white p-8 rounded-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 outline-none " >
                    <h3 className="font-semibold text-lg mb-4"  >All applicants</h3>
                    {!applicantModal[0]?.applied_at && <p>No applications yet</p>}
                    {applicantModal[0]?.applied_at &&
                        <ul className='flex flex-col gap-4 max-h-[20rem] overflow-auto ' >
                            {applicantModal && applicantModal?.map(item => {
                                return <li className='flex gap-2'>
                                    <div className='w-12  relative' >
                                        <Image alt="avatar" className="object-cover rounded-full " fill src={"/assets/avatar.png"} />
                                    </div>
                                    <div>
                                        <Link href={`/user/${item.user_id}`}>
                                            <h3 className='text-blue-700 cursor-pointer hover:underline font-medium'  >{item.user_name}</h3>
                                        </Link>

                                        <p className='text-gray-500' >{moment(item.applied_at).format("DD MMM YYYY")}</p>
                                    </div>
                                </li>
                            })}
                        </ul>
                    }
                </div>
            </Modal>
            <Modal open={deleteModal} onClose={() => setDeleteModal(false)} >
                <div className=" w-4/12 flex flex-col bg-white p-8 rounded-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 outline-none " >
                    <h3 className='text-lg' >Are you sure you want to delete <strong className='text-blue-500' >{deleteModal?.job_title}</strong>?</h3>
                    <div className='flex mt-4 gap-4 justify-end items-center' >
                        <button onClick={() => setDeleteModal(false)} className="bg-white border border-blue-500 text-blue-500 rounded-md py-2 mt-5  transition duration-200  w-40" >Cancel</button>
                        <button onClick={() => handle_delete_job(deleteModal.job_id)} className="bg-red-500 text-white rounded-md py-2 mt-5 hover:shadow-md transition duration-200 hover:bg-red-600 w-40" >Delete</button>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    )
}

export default ManageJob