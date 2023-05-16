import Header from '@/components/header/Header'
import Image from 'next/image'
import React, { useState } from 'react'
import { BsBookmark, BsCashCoin, BsGenderAmbiguous } from 'react-icons/bs'
import { CiLocationOn, CiTimer } from 'react-icons/ci'
import { SlBriefcase } from 'react-icons/sl'
import { BsCalendar4Event } from "react-icons/bs"
import { AiOutlineUser, AiOutlineTwitter, AiFillGithub } from "react-icons/ai"
import { RiFacebookFill, RiLinkedinFill } from "react-icons/ri"
import { FiInstagram } from "react-icons/fi"
import Link from 'next/link'
import UNIVERSAL from '@/config/config'
import { GetStaticPaths, GetStaticProps } from 'next'
import moment from 'moment'

import { User } from '@/entity/user'
import { IoBriefcaseOutline, IoCallOutline } from 'react-icons/io5'
import { RxAvatar } from 'react-icons/rx'
import { MdOutlineEmail } from "react-icons/md"
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { Resume } from '@/entity/resume'

const User = ({ user, resume }: Props) => {

    console.log(user)

    return (
        <>
            <Header />
            <div className="min-h-screen pt-[var(--header-height)] ">
                <div className='bg-gradient-to-br from-violet-50 from-50% to-blue-300 px-10 py-20 flex items-center justify-between shadow-sm' >
                    <div className='  flex items-start justify-between gap-6'>
                        <Image className='rounded-lg' alt="company logo" width={100} height={100} src={`${UNIVERSAL.BASEURL}/profilePic/${user?.avatar}`} />
                        <div >
                            <h1 className='text-2xl font-medium mb-3 ' >{user?.name}</h1>
                            <div className='flex items-center gap-6'>

                                {/* <div className='flex gap-2 items-center'>
                                    <CiLocationOn />
                                    <p className='font-light' >{user?.location}</p>
                                </div> */}
                                <div className='flex gap-2 items-center'>
                                    <CiTimer />
                                    <p className='font-light' >{moment(user?.created_at).format("LL")}</p>
                                </div>
                                <div className='flex gap-2 items-center'>
                                    <BsCashCoin />
                                    <p className='font-light' >{user?.expected_salary}</p>
                                </div>

                            </div>
                            {/* <div className='flex items-center gap-4 mt-3'>
                                <div className='py-1 px-4 bg-blue-100 text-blue-600 rounded-2xl'>
                                    <p className='text-sm' >{user?.job_type}</p>
                                </div>
                                <div className='py-1 px-4 bg-orange-100 text-orange-600 rounded-2xl'>
                                    <p className='text-sm' >Urgent</p>
                                </div>
                                <div className='py-1 px-4 bg-green-100 text-green-600 rounded-2xl'>
                                    <p className='text-sm' >Remote</p>
                                </div>
                            </div> */}
                        </div>

                    </div>
                    <div className='flex items-center gap-4' >
                        <a target='_blank' href={`${UNIVERSAL.BASEURL}/resume/${user?.resume}`}  >
                            <button className="bg-blue-600 px-7  text-white rounded-md py-3  hover:shadow-lg transition duration-200 hover:bg-blue-600" >Download resume</button>
                        </a>
                        <button className='bg-gray-50 hover:shadow-lg transition-all duration-200  p-4 rounded-md ' >
                            <BsBookmark className='text-blue-500' />
                        </button>
                    </div>
                </div>
                <div className='py-16 px-14' >
                    <div className='flex gap-16' >
                        <div className='w-7/12' >
                            <h3 className='font-medium text-xl mb-5'>About Me</h3>
                            <p className='text-gray-500 leading-7' >{user?.bio}</p>
                            <div className='mt-10' >
                                <h3 className='font-medium text-xl mb-3'>Education</h3>
                                {resume?.educations?.map(item => {
                                    return <div className='mb-12'  >
                                        <div className="flex gap-5 items-center mb-2">
                                            <h3 className="font-medium text-xl" >{item.degree}</h3>
                                            <p className="text-sm font-medium text-green-600 py-1 px-4 rounded-xl bg-gray-100" >{moment(item.start_date).format("LL")} - {moment(item.end_date).format("LL")}</p>
                                        </div>

                                        <h4 className="text-blue-500 mb-3" >{item.institute}</h4>
                                        <p className="w-[80%] text-gray-400 " >{item.description}</p>
                                    </div>
                                })}


                            </div>
                            <div className='mt-10' >
                                <h3 className='font-medium text-xl mb-3'>Work Experience</h3>
                                {resume?.work_experience?.map(item => {
                                    return <div className='mb-12'  >
                                        <div className="flex gap-5 items-center mb-2">
                                            <h3 className="font-medium text-xl" >{item.job_title}</h3>
                                            <p className="text-sm font-medium text-green-600 py-1 px-4 rounded-xl bg-gray-100" >{moment(item.start_date).format("LL")} - {moment(item.end_date).format("LL")}</p>
                                        </div>

                                        <h4 className="text-blue-500 mb-3" >{item.company}</h4>
                                        <p className="w-[80%] text-gray-400 " >{item.description}</p>
                                    </div>
                                })}
                            </div>
                            <div className='mt-10' >
                                <h3 className='font-medium text-xl mb-3'>Projects</h3>
                                {resume?.projects?.map(item => {
                                    return <div className='mb-12'  >
                                        <div className="flex gap-5 items-center mb-2">
                                            <h3 className="font-medium text-xl" >{item.project_name}</h3>
                                            <p className="text-sm font-medium text-green-600 py-1 px-4 rounded-xl bg-gray-100" >{moment(item.start_date).format("LL")} - {moment(item.end_date).format("LL")}</p>
                                        </div>
                                        <p className="w-[80%] text-gray-400 " >{item.description}</p>
                                    </div>
                                })}

                            </div>
                        </div>
                        <div className='w-5/12'>
                            {/* user details  starts*/}
                            <div className='mb-8 p-6 bg-gray-100 rounded-md shadow-sm flex-1 '>
                                <h3 className='font-medium text-xl mb-5'>Overview</h3>
                                <ul className='flex flex-col gap-6'>
                                    <li className='flex gap-5 items-center '>
                                        <IoBriefcaseOutline className='text-2xl text-blue-600' />
                                        <div>
                                            <h3 className='font-medium text-lg  ' >Experience</h3>
                                            <p className='font-light' >{user?.experience}</p>
                                        </div>

                                    </li>
                                    <li className='flex gap-5 items-center '>
                                        <RxAvatar className='text-2xl text-blue-600' />
                                        <div>
                                            <h3 className='font-medium text-lg  ' >Age</h3>
                                            <p className='font-light' >{user.age}</p>
                                        </div>
                                    </li>
                                    <li className='flex gap-5 items-center '>
                                        <BsGenderAmbiguous className='text-2xl text-blue-600' />
                                        <div>
                                            <h3 className='font-medium text-lg  ' >Gender</h3>
                                            <p className='font-light' >Male</p>
                                        </div>
                                    </li>
                                    <li className='flex gap-5 items-center '>
                                        <MdOutlineEmail className='text-2xl text-blue-600' />
                                        <div>
                                            <h3 className='font-medium text-lg  ' >Email</h3>
                                            <p className='font-light' >{user?.email}</p>
                                        </div>
                                    </li>
                                    <li className='flex gap-5 items-center '>
                                        <IoCallOutline className='text-2xl text-blue-600' />
                                        <div>
                                            <h3 className='font-medium text-lg  ' >Phone no.</h3>
                                            <p className='font-light' >{user.phone}</p>
                                        </div>
                                    </li>
                                </ul>
                                <div className='mt-5'>
                                    <h3 className='font-medium text-lg  ' >Skills</h3>
                                    <div className='w-full flex gap-3 mt-2 flex-wrap'>
                                        {resume?.skills?.split(",").map((item: any, i: number) => {
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
                                <div className='flex justify-between items-center' >
                                    <h3 className='font-medium text-lg '>Social media</h3>
                                    <div className='flex gap-3 items-center'>
                                        <a target='_blank' href={user?.facebook_link}>
                                            <RiFacebookFill className='text-xl text-gray-600' />
                                        </a>
                                        <a target='_blank' href={user?.twitter_link}>
                                            <AiOutlineTwitter className='text-xl text-gray-600' />
                                        </a>
                                        <a target='_blank' href={user?.github_link}>
                                            <AiFillGithub className='text-xl text-gray-600' />
                                        </a>
                                        <a target='_blank' href={user?.linkedin_link}>
                                            <RiLinkedinFill className='text-xl text-gray-600' />
                                        </a>
                                    </div>
                                </div>
                            </div>
                            {/* Company details ends */}
                        </div>


                    </div>
                </div>
            </div>
            {/* <Modal open={applyModal} onClose={() => setApplyModal(false)} >
                <div className=" w-4/12 flex flex-col bg-white p-8 rounded-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 outline-none " >
                    <form onSubmit={handleSubmit(handle_apply_job)} >
                        <h3 className="font-semibold text-lg mb-4"  >Applying for {user?.job_title}</h3>
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
            </Modal> */}
        </>
    )
}

export default User

export const getStaticPaths: GetStaticPaths = async () => {
    let res = await fetch(`${UNIVERSAL.BASEURL}/api/users`);
    const user_list: UserResponse = await res.json();

    const all_paths = user_list?.data?.map((item: any) => {
        return {
            params: {
                user_id: `${item.id}`
            }
        }
    })

    return {
        paths: all_paths,
        fallback: false, // can also be true or 'blocking'
    };
}

export const getStaticProps: GetStaticProps = async (context) => {
    const { user_id } = context.params as any

    const res = await fetch(`${UNIVERSAL.BASEURL}/api/users/${user_id}`)
    const user_data = await res.json()

    const res2 = await fetch(`${UNIVERSAL.BASEURL}/api/resume/${user_id}`)
    const resume = await res2.json()

    return {
        props: {
            user: user_data.data,
            resume: resume.data
        }
    }
}

type Props = {
    user: User,
    resume: Resume
}

type UserResponse = {
    status: string,
    data: any
}