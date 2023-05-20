import Header from '@/components/header/Header'
import Image from 'next/image'
import React, { useState } from 'react'
import { BsBookmark, BsCashCoin } from 'react-icons/bs'
import { CiLocationOn, CiTimer } from 'react-icons/ci'
import { SlBriefcase } from 'react-icons/sl'
import { BsCalendar4Event } from "react-icons/bs"
import { AiOutlineUser, AiOutlineTwitter } from "react-icons/ai"
import { RiFacebookFill, RiLinkedinFill } from "react-icons/ri"
import { FiInstagram } from "react-icons/fi"
import Link from 'next/link'
import UNIVERSAL from '@/config/config'
import { GetStaticPaths, GetStaticProps } from 'next'
import moment from 'moment'
import { Alert, Modal, Snackbar } from '@mui/material'
import { useForm } from 'react-hook-form'
import { Job } from '@/entity/jobs'
import { Company } from '@/entity/company'
import { useAppSelector } from '@/hooks/useAppSelector'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { applyJob } from '@/slices/job/jobSlice'

const JobDetail = ({ job, company }: Props) => {
    const [applyModal, setApplyModal] = useState(false)
    const [notLoggedInSnackbar, setNotLoggedInSnackbar] = useState(false);

    const auth = useAppSelector(state => state.authentication.data)

    const dispatch = useAppDispatch()

    const {
        register,
        handleSubmit,
        // formState: { errors },
        // reset
    } = useForm<ApplyJobFormData>();

    const handle_apply_job = (data: ApplyJobFormData) => {
        dispatch(applyJob({
            jobId: job.id,
            message: data.message,
            resume: "",
            token: auth.token
        })).unwrap()
            .then(() => setApplyModal(false))
    }

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setNotLoggedInSnackbar(false);
    };

    const get_color = () => {
        var letters = 'BCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * letters.length)];
        }
        return color;
    }

    return (
        <>
            <Header />
            <div className="min-h-screen pt-[var(--header-height)] ">
                <div style={{ backgroundImage: `linear-gradient(to bottom right, ${get_color()} 50%, ${get_color()})` }} className={` px-10 py-20 flex items-center justify-between shadow-sm`} >
                    <div className='  flex items-start justify-between gap-6'>
                        <Image alt="company logo" width={100} height={100} src={`${UNIVERSAL.BASEURL}/company/${company?.company_logo}`} />
                        <div >
                            <h1 className='text-2xl font-medium mb-3 ' >{job.job_title}</h1>
                            <div className='flex items-center gap-6'>
                                <div className='flex gap-2 items-center'>
                                    <SlBriefcase />
                                    <p className='font-light'>{job.industry}</p>
                                </div>
                                <div className='flex gap-2 items-center'>
                                    <CiLocationOn />
                                    <p className='font-light' >{job.location}</p>
                                </div>
                                <div className='flex gap-2 items-center'>
                                    <CiTimer />
                                    <p className='font-light' >{moment(job.created_at).format("LL")}</p>
                                </div>
                                <div className='flex gap-2 items-center'>
                                    <BsCashCoin />
                                    <p className='font-light' >{job.salary}</p>
                                </div>
                            </div>
                            <div className='flex items-center gap-4 mt-3'>
                                <div className='py-1 px-4 bg-blue-100 text-blue-600 rounded-2xl'>
                                    <p className='text-sm' >{job.job_type}</p>
                                </div>
                                {job.urgent &&
                                    <div className='py-1 px-4 bg-orange-100 text-orange-600 rounded-2xl'>
                                        <p className='text-sm' >Urgent</p>
                                    </div>}
                                {job.remote &&
                                    <div className='py-1 px-4 bg-green-100 text-green-600 rounded-2xl'>
                                        <p className='text-sm' >Remote</p>
                                    </div>}
                            </div>
                        </div>

                    </div>
                    <div className='flex items-center gap-4' >
                        <button onClick={() => auth.token ? setApplyModal(true) : setNotLoggedInSnackbar(true)} className="bg-blue-600 px-7  text-white rounded-md py-3  hover:shadow-lg transition duration-200 hover:bg-blue-600" >Apply for job</button>
                        <button className='bg-gray-50 hover:shadow-lg transition-all duration-200  p-4 rounded-md ' >
                            <BsBookmark className='text-blue-500' />
                        </button>
                    </div>
                </div>
                <div className='py-16 px-14' >
                    <div className='flex gap-16' >
                        <div className='w-7/12' >
                            <h3 className='font-medium text-xl mb-5'>Job Description</h3>
                            <div className='[&>ul]:list-disc [&>ul]:ml-8 [&>ol]:text-gray-600 [&>ol]:list-decimal [&>ol]:ml-8 [&>ul]:text-gray-600 [&>h2]:text-3xl [&>h2]:font-bold [&>h3]:text-2xl [&>h3]:font-semibold [&>h4]:text-lg [&>h4]:font-medium [&>p]:text-gray-600' dangerouslySetInnerHTML={{ __html: job?.description }} />
                            <button className=" bg-blue-500 text-white rounded-md py-3 mt-8 hover:shadow-md transition duration-200 hover:bg-blue-600 w-80 " >Compare resume</button>
                        </div>
                        <div className='w-5/12'>
                            {/* job details  starts*/}
                            <div className='mb-8 p-6 bg-gray-100 rounded-md shadow-sm flex-1 '>
                                <h3 className='font-medium text-xl mb-5'>Job Overview</h3>
                                <ul className='flex flex-col gap-6'>
                                    <li className='flex gap-5 items-center '>
                                        <BsCalendar4Event className='text-2xl text-blue-600' />
                                        <div>
                                            <h3 className='font-medium text-lg  ' >Date posted</h3>
                                            <p className='font-light' >{moment(job.created_at).format("LL")}</p>
                                        </div>

                                    </li>
                                    <li className='flex gap-5 items-center '>
                                        <CiLocationOn className='text-2xl text-blue-600' />
                                        <div>
                                            <h3 className='font-medium text-lg  ' >Location</h3>
                                            <p className='font-light' >{job.location}</p>
                                        </div>
                                    </li>
                                    <li className='flex gap-5 items-center '>
                                        <AiOutlineUser className='text-2xl text-blue-600' />
                                        <div>
                                            <h3 className='font-medium text-lg  ' >Job Title</h3>
                                            <p className='font-light' >{job.job_title}</p>
                                        </div>
                                    </li>
                                    <li className='flex gap-5 items-center '>
                                        <BsCashCoin className='text-2xl text-blue-600' />
                                        <div>
                                            <h3 className='font-medium text-lg  ' >Salary</h3>
                                            <p className='font-light' >{job.salary}</p>
                                        </div>
                                    </li>
                                </ul>
                                <div className='mt-5'>
                                    <h3 className='font-medium text-lg  ' >Skills required</h3>
                                    <div className='w-full flex gap-3 mt-2 flex-wrap'>
                                        {job.skills_required.split(",").map((item: any, i: number) => {
                                            return <div key={i} className='bg-white rounded-sm py-2 px-5'>
                                                <p>{item}</p>
                                            </div>
                                        })}


                                    </div>
                                </div>
                            </div>
                            {/* Job details ends */}
                            {/* Company details starts */}
                            <div className='p-6 bg-gray-100 rounded-md shadow-sm flex-1 '>
                                <div className='flex gap-4 items-start'>
                                    <Image className='rounded-md' alt="company logo" width={60} height={60} src={`${UNIVERSAL.BASEURL}/company/${company?.company_logo}`} />
                                    <div>
                                        <h3 className='font-medium text-lg'>{company.company_name}</h3>
                                        <Link className='text-blue-500 ' href={`/company/${company?.id}`}>View company profile</Link>
                                    </div>
                                </div>
                                <ul className='flex flex-col gap-5 mt-6 text-gray-900'>
                                    <li className='flex justify-between items-center'>
                                        <h4 className='font-medium'>Primary industry</h4>
                                        <p>{company?.primary_industry}</p>
                                    </li>
                                    <li className='flex justify-between items-center'>
                                        <h4 className='font-medium'>Company size</h4>
                                        <p>{company?.company_size}</p>
                                    </li>
                                    <li className='flex justify-between items-center'>
                                        <h4 className='font-medium'>Founded in</h4>
                                        <p>{company?.est_since}</p>
                                    </li>
                                    <li className='flex justify-between items-center'>
                                        <h4 className='font-medium'>Phone</h4>
                                        <p>{company?.phone}</p>
                                    </li>
                                    <li className='flex justify-between items-center'>
                                        <h4 className='font-medium'>Email</h4>
                                        <p>{company?.email}</p>
                                    </li>
                                    <li className='flex justify-between items-center'>
                                        <h4 className='font-medium'>Location</h4>
                                        <p>{company?.location}</p>
                                    </li>
                                    <li className='flex justify-between items-center'>
                                        <h4 className='font-medium'>Social media</h4>
                                        <div className='flex gap-3 items-center'>
                                            <a target='_blank' href={company?.facebook_link}>
                                                <RiFacebookFill />
                                            </a>
                                            <a target='_blank' href={company?.twitter_link}>
                                                <AiOutlineTwitter />
                                            </a>
                                            <a target='_blank' href={company?.google_plus_link}>
                                                <FiInstagram />
                                            </a>
                                            <a target='_blank' href={company?.linkedin_link}>
                                                <RiLinkedinFill />
                                            </a>
                                        </div>
                                    </li>
                                </ul>
                                <button className='w-full h-12 flex items-center justify-center bg-cyan-300 rounded-lg text-blue-700 mt-5 hover:bg-blue-600 hover:text-white transition duration-200 '  >visit company website</button>
                            </div>
                            {/* Company details ends */}
                        </div>


                    </div>
                </div>
            </div >
            <Modal open={applyModal} onClose={() => setApplyModal(false)} >
                <div className=" w-4/12 flex flex-col bg-white p-8 rounded-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 outline-none " >
                    <form onSubmit={handleSubmit(handle_apply_job)} >
                        <h3 className="font-semibold text-lg mb-4"  >Applying for {job.job_title}</h3>
                        <div className="flex flex-col gap-1 mb-2" >
                            <label className="mb-1 font-normal" htmlFor="message">Message</label>
                            <textarea className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" {...register("message")} id="message" placeholder="Message" rows={5} />
                        </div>
                        <div className="flex flex-col gap-1 mb-2">
                            <label className="mb-1 font-normal" htmlFor="resume">Upload resume</label>
                            <input className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" {...register("resume")} id="resume" placeholder="Resume" type="file" />
                        </div>
                        <button type="submit" className="bg-blue-500 text-white rounded-md py-3 mt-5 hover:shadow-md transition duration-200 hover:bg-blue-600 w-full" >Apply</button>
                    </form>
                </div>
            </Modal>
            <Snackbar anchorOrigin={{ vertical: "top", horizontal: "center" }} open={notLoggedInSnackbar} autoHideDuration={6000} onClose={handleClose}>
                <Alert variant='filled' severity="warning" onClose={handleClose} sx={{ width: '100%' }}>
                    Please log in to apply.
                </Alert>
            </Snackbar>
        </>
    )
}

export default JobDetail

type JobResponse = {
    status: string,
    data: any
}

export const getStaticPaths: GetStaticPaths = async () => {
    let res = await fetch(`${UNIVERSAL.BASEURL}/api/jobs`);
    const job_list: JobResponse = await res.json();

    const all_paths = job_list?.data?.map((item: any) => {
        return {
            params: {
                job_id: `${item.id}`
            }
        }
    })

    return {
        paths: all_paths,
        fallback: false, // can also be true or 'blocking'
    };
}

export const getStaticProps: GetStaticProps = async (context) => {

    const { job_id } = context.params as any

    const res = await fetch(`${UNIVERSAL.BASEURL}/api/jobs/${job_id}`)

    const job_data = await res.json()

    const res2 = await fetch(`${UNIVERSAL.BASEURL}/api/company/${job_data?.data?.company_id}`)

    const company_data = await res2.json()

    return {
        props: {
            job: job_data.data,
            company: company_data.data
        }
    }
}

type Props = {
    job: Job,
    company: Company
}

type ApplyJobFormData = {
    message: string,
    resume: string,
}

