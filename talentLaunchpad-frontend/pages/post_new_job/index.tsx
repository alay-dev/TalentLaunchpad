import DashboardLayout from '@/components/dashboardLayout/DashboardLayout'
import React, { useState } from 'react'
import { IoMdClose } from "react-icons/io"
import { useForm } from 'react-hook-form';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { addJobDetail, getUserJobs } from '@/slices/job/jobSlice';

const PostNewJob = () => {
    const [skills, setSkills] = useState<string[]>([]);
    const [skillTmp, setSkillTmp] = useState("");

    const user = useAppSelector((state) => state.user)
    const auth = useAppSelector(state => state.authentication.data)
    const dispatch = useAppDispatch()

    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<PostJobFormData>();


    const handle_skills = (e: React.KeyboardEvent<HTMLInputElement>) => {

        if (e.key === "Enter" && skillTmp !== "") {
            setSkills([...new Set([...skills, skillTmp])]);
            setSkillTmp("");
            update_skills([...new Set([...skills, skillTmp])].toString())
        }
    }

    const remove_skill = (item: string) => {
        const tmp = skills.filter(skill => skill !== item);
        setSkills(tmp);

        update_skills(tmp.toString());
    }

    const update_skills = (data: string) => {
        console.log(skills.toString(), skills)
    }

    const handle_post_job = (data: PostJobFormData) => {
        dispatch(addJobDetail({
            ...data,
            skillsRequired: skills.toString(),
            companyId: user.data.company_id,
            token: auth.token
        })).unwrap()
            .then(() => dispatch(getUserJobs({ token: auth.token })))
    }

    return (
        <DashboardLayout>
            <div className="w-full">
                <h1 className='font-medium text-3xl '>Post a new job</h1>
                <div className="bg-white rounded-lg mt-8 shadow-[0_6px_15px_rgba(64,79,104,.05)]   p-5">
                    {!user.data.company_id &&
                        <h3>You don&apos;t have a company yet!! Please create a company first.</h3>
                    }
                    {user.data.company_id &&
                        <form onSubmit={handleSubmit(handle_post_job)}>


                            <div className="flex gap-5 mb-5">
                                <div className="flex flex-col w-full">
                                    <label className="mb-1 font-medium" htmlFor="jobTitle">Job title</label>
                                    <input className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" {...register("jobTitle")} id="jobTitle" placeholder="Job title" type="text" />
                                </div>
                                <div className="flex flex-col w-full">
                                    <label className="mb-1 font-medium" htmlFor="applyLink">Apply Link</label>
                                    <input className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" {...register("applyLink")} id="applyLink" placeholder="Apply Link" type="text" />
                                </div>
                            </div>
                            <div className="flex flex-col w-full mb-5">
                                <label className="mb-1 font-medium" htmlFor="jobDescription">Job Description</label>
                                <textarea className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md"  {...register("description")} id="jobDescription" placeholder="Job Description" rows={10} />
                            </div>
                            <div className="flex gap-5 mb-5">
                                <div className="flex flex-col w-1/2">
                                    <label className="mb-1 font-medium" htmlFor="phone">Job Type</label>
                                    <select className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" {...register("jobType")} id="jobType" >
                                        <option value="Internship" >Internship</option>
                                        <option value="Part Time" >Part Time</option>
                                        <option value="Full Time" >Full Time</option>
                                        <option value="Freelance" >Freelance</option>
                                    </select>
                                </div>
                                <div className="flex flex-col w-1/2">
                                    <label className="mb-1 font-medium" htmlFor="qualificationRequired">Qualification required</label>
                                    <input className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" {...register("qualificationRequired")} id="qualificationRequired" placeholder="Qualification" type="text" />
                                </div>
                            </div>
                            <div className="flex gap-5 mb-5">
                                <div className="flex flex-col w-1/2">
                                    <label className="mb-1 font-medium" htmlFor="experienceRequired">Experience required (in yrs)</label>
                                    <input className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" {...register("experienceRequired")} id="experienceRequired" placeholder="Experience required" type="text" />
                                </div>
                                <div className="flex flex-col w-1/2">
                                    <label className="mb-1 font-medium" htmlFor="location">Location</label>
                                    <select className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" {...register("location")} id="location" >
                                        <option value="Bangalore" >Bangalore</option>
                                        <option value="Chennai" >Chennai</option>
                                        <option value="Delhi" >Delhi</option>
                                        <option value="Remote" >Remote</option>

                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-5 mb-5 mt-4">
                                <div className="flex flex-col w-1/2">
                                    <label className="mb-1 font-medium" htmlFor="salary">Salary</label>
                                    <input className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" {...register("salary")} id="salary" placeholder="Salary" type="text" />
                                </div>
                                <div className="flex flex-col w-1/2">
                                    <label className="mb-1 font-medium" htmlFor="employeeResume">Employee resume</label>
                                    <input className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" id="employeeResume" placeholder="Employee Resume" type='file' />
                                </div>
                            </div>
                            <div className="flex w-full mt-5 justify-between">
                                <h3 className="mb-5 font-medium" >Skills required</h3>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center flex-wrap gap-4 w-1/2">
                                    {skills?.map((item, i) => {
                                        return <div key={i} className="py-2 px-4 rounded-md shadow-sm flex items-center gap-2 bg-gray-100">
                                            <p>{item}</p>
                                            <IoMdClose className="cursor-pointer" onClick={() => { remove_skill(item) }} />
                                        </div>
                                    })}
                                </div>
                                <div className=" mt-5 flex flex-col w-1/2">
                                    <input className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" id="skillInput" placeholder="Enter to add skill"
                                        value={skillTmp}
                                        onChange={(e) => setSkillTmp(e.target.value)}
                                        onKeyDown={(e) => handle_skills(e)}
                                    />
                                </div>
                            </div>
                            <button type="submit" className="bg-blue-500 text-white rounded-md py-3 mt-5 hover:shadow-md transition duration-200 hover:bg-blue-600 w-60" >Post job</button>
                        </form>
                    }
                </div>
            </div>
        </DashboardLayout>
    )
}

export default PostNewJob


type PostJobFormData = {
    jobTitle: string,
    description: string,
    jobType: string,
    qualificationRequired: string,
    experienceRequired: string
    location: string,
    salary: string,
    applyLink: string
}
