import DashboardLayout from "@/components/dashboardLayout/DashboardLayout"
import { IconButton, Modal } from "@mui/material"
import { GrAdd } from "react-icons/gr"
import { HiOutlinePencil } from "react-icons/hi"
import { RiDeleteBin6Line } from "react-icons/ri"
import { IoMdClose } from "react-icons/io"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { addEducation, addProject, addWorkExperience, changeResume, deleteEducation, deleteWorkExperience, getResume, updateResume } from "@/slices/resume/resumeSlice"
import { useAppSelector } from "@/hooks/useAppSelector"
import moment from "moment"
import UNIVERSAL from "@/config/config"


const MyResume = () => {
    const [educationModal, setEducationModal] = useState(false);
    const [workModal, setWorkModal] = useState(false)
    const [projectModal, setProjectModal] = useState(false);
    const [skills, setSkills] = useState<string[]>([]);
    const [skillTmp, setSkillTmp] = useState("");
    const [description, setDescription] = useState("");
    const [changeResumeModal, setChangeResumeModal] = useState(false)
    const [resumeTmp, setResumeTmp] = useState<any>()

    const dispatch = useAppDispatch();
    const auth = useAppSelector(state => state.authentication)
    const user = useAppSelector(state => state.user)
    const resume = useAppSelector(state => state.resume)

    useEffect(() => {
        if (auth.data.token) {
            console.log(auth.data.token, "TOKEN")
            dispatch(getResume({
                user_id: user.data.id
            }))
        }
    }, [auth.data.token])

    useEffect(() => {
        setDescription(resume.data.description);
        if (resume.data.skills) setSkills(resume.data.skills.split(","))
    }, [resume.data.description, resume.data.skills])

    const {
        register: registerEducation,
        handleSubmit: handleSubmitEducation,
        // formState: { errors },
        // reset
    } = useForm<EducationFormData>();

    const {
        register: registerWorkExperience,
        handleSubmit: handleSubmitWorkExperience,
        // formState: { errors },
        // reset
    } = useForm<WorkExperienceFormData>();

    const {
        register: registerProject,
        handleSubmit: handleSubmitProject,
        // formState: { errors },
        // reset
    } = useForm<ProjectFormData>();

    const handle_skills = (e: React.KeyboardEvent<HTMLInputElement>) => {
        console.log(e.key);
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

    const handle_education = (data: EducationFormData) => {
        dispatch(addEducation({
            school: data.school,
            degree: data.degree,
            description: data.description,
            startDate: data.startDate,
            endDate: data.endDate,
            token: auth.data.token
        })).unwrap()
            .then(() => dispatch(getResume({ user_id: user.data.id })))
    }

    const handle_work_experience = (data: WorkExperienceFormData) => {
        dispatch(addWorkExperience({
            company: data.company,
            jobTitle: data.jobTitle,
            description: data.description,
            startDate: data.startDate,
            endDate: data.endDate,
            token: auth.data.token
        })).unwrap()
            .then(() => dispatch(getResume({ user_id: user.data.id })))
    }

    const handle_project = (data: ProjectFormData) => {
        dispatch(addProject({
            projectName: data.projectName,
            description: data.description,
            startDate: data.startDate,
            endDate: data.endDate,
            token: auth.data.token
        })).unwrap()
            .then(() => dispatch(getResume({ user_id: user.data.id })))
    }

    const update_description = () => {
        console.log(skills.toString(), skills)
        dispatch(updateResume({
            description: description,
            skills: resume.data.skills,
            token: auth.data.token
        })).unwrap()
            .then(res => dispatch(getResume({ user_id: user.data.id })))
    }

    const update_skills = (data: string) => {
        console.log(skills.toString(), skills)
        dispatch(updateResume({
            description: resume.data.description,
            skills: data,
            token: auth.data.token
        })).unwrap()
            .then(res => dispatch(getResume({ user_id: user.data.id })))
    }

    const delete_education = (id: number) => {
        dispatch(deleteEducation({
            token: auth.data.token,
            education_id: id
        }))
    }

    const delete_work_experience = (id: number) => {
        dispatch(deleteWorkExperience({
            token: auth.data.token,
            work_experience_id: id
        }))
    }

    const handle_change_resume = (files: FileList | null) => {
        if (files?.length) {
            setChangeResumeModal(true);
            setResumeTmp(files[0])
            console.log(files[0])
        }
    }

    const handle_upload_resume = () => {
        dispatch(changeResume({ token: auth.data.token, resume: resumeTmp }))
            .unwrap()
            .then(() => { dispatch(getResume({ user_id: user.data.id })); setChangeResumeModal(false) })
    }




    return (
        <DashboardLayout>
            <div className="w-full">
                <h1 className='font-medium text-3xl '>My Resume</h1>
                <div className="bg-white rounded-lg mt-8 shadow-[0_6px_15px_rgba(64,79,104,.05)]   p-5">
                    {resume?.data?.resume_link &&
                        <div className="flex items-center gap-3 w-1/2 ">
                            <a target="_blank" href={`${UNIVERSAL.BASEURL}/resume/${resume?.data?.resume_link}`} >
                                <p className="text-blue-500 hover:underline cursor-pointer" >{resume?.data?.resume_name}</p>
                            </a>
                            <label className="cursor-pointer text-sm mb-1 font-medium bg-slate-200 hover:text-blue-600 hover:shadow-sm transition duration-200 text-blue-500 w-max py-2 px-4 rounded-md " htmlFor="resume">Change resume</label>
                            <input className="focus:bg-white hidden  focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" onChange={(e) => handle_change_resume(e.target.files)} id="resume" placeholder="Select your resume" type="file" />
                        </div>
                    }
                    {!resume?.data?.resume_link &&
                        <div className="flex flex-col w-1/2">
                            <label className="mb-1 font-medium" htmlFor="CV">Upload your Resume</label>
                            <input className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" onChange={(e) => handle_change_resume(e.target.files)} id="CV" placeholder="Select your resume" type="file" />
                        </div>
                    }
                    <div className="flex flex-col w-full mt-5 ">
                        <label className="mb-1 font-medium" htmlFor="Description">Description</label>
                        <textarea className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            onBlur={() => update_description()}
                            id="Description"
                            placeholder="Description"
                            rows={10} />
                    </div>
                    <div className="flex w-full mt-10 justify-between">
                        <h3 className="mb-5 font-medium" >Education</h3>
                        <div onClick={() => setEducationModal(true)} className="flex gap-2 items-center text-red-500 cursor-pointer"  >
                            <div className="p-2 bg-gray-100 rounded-full">
                                <GrAdd />
                            </div>
                            <p>Add education</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-8">
                        {resume?.data?.educations?.length === 0 && <p className="text-sm text-gray-400">Complete Your Profile: Add Education Details for a Comprehensive Profile</p>}

                        {resume?.data?.educations?.map((item: any) => {
                            return <div key={item.id} >
                                <div className="flex gap-5 items-center">
                                    <h3 className="font-medium text-xl" >{item.degree}</h3>
                                    <p className="text-sm font-medium text-green-600 py-1 px-4 rounded-xl bg-gray-100" >{moment(item.start_date).format("MMM, YYYY")} - {moment(item.end_date).format("MMM, YYYY")}</p>
                                </div>

                                <h4 className="text-blue-500 mb-3" >{item.institute}</h4>
                                <p className="w-[80%] text-gray-400 " >{item.description}</p>
                                <div className="flex gap-5 items-center mt-2 ">
                                    <IconButton size="small" >
                                        <HiOutlinePencil className="text-blue-500" />
                                    </IconButton>
                                    <IconButton size="small" onClick={() => delete_education(item.id)} >
                                        <RiDeleteBin6Line className="text-red-500" />
                                    </IconButton>
                                </div>
                            </div>
                        })}

                    </div>
                    {/* Education ends  */}
                    {/* Work & exerience start */}
                    <div className="flex w-full mt-16 justify-between">
                        <h3 className="mb-5 font-medium" >Work & Experience</h3>
                        <div className="flex gap-2 items-center text-red-500 cursor-pointer" onClick={() => setWorkModal(true)} >
                            <div className="p-2 bg-gray-100 rounded-full">
                                <GrAdd />
                            </div>
                            <p>Add work</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-8">
                        {resume?.data?.work_experience?.length === 0 && <p className="text-sm text-gray-400" >Highlight Your Expertise: Enhance Your Profile with Work Experience</p>}
                        {resume?.data?.work_experience?.map((item: any) => {
                            return <div key={item.id}>
                                <div className="flex gap-5 items-center">
                                    <h3 className="font-medium text-xl" >{item.job_title}</h3>
                                    <p className="text-sm font-medium text-green-600 py-1 px-4 rounded-xl bg-gray-100" >{moment(item.start_date).format("MMM, YYYY")} - {moment(item.end_date).format("MMM, YYYY")}</p>
                                </div>

                                <h4 className="text-blue-500 mb-3" >{item.company}</h4>
                                <p className="w-[80%] text-gray-400 " >{item.description}</p>
                                <div className="flex gap-5 items-center mt-2 ">
                                    <IconButton size="small" >
                                        <HiOutlinePencil className="text-blue-500" />
                                    </IconButton>
                                    <IconButton size="small" onClick={() => delete_work_experience(item.id)} >
                                        <RiDeleteBin6Line className="text-red-500" />
                                    </IconButton>
                                </div>
                            </div>
                        })}


                    </div>
                    {/* Work & exerience ends */}
                    {/* Project start */}
                    <div className="flex w-full mt-16 justify-between">
                        <h3 className="mb-5 font-medium" >Projects</h3>
                        <div className="flex gap-2 items-center text-red-500 cursor-pointer" onClick={() => setProjectModal(true)}  >
                            <div className="p-2 bg-gray-100 rounded-full">
                                <GrAdd />
                            </div>
                            <p>Add project</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-8">
                        {resume?.data?.projects?.length === 0 && <p className="text-sm text-gray-400">Showcase Your Skills: Add Project Details to Enhance Your Profile</p>}

                        {resume?.data?.projects?.map((item: any) => {
                            return <div key={item.id}>
                                <div className="flex gap-5 items-center">
                                    <h3 className="font-medium text-xl" >{item.project_name}</h3>
                                    <p className="text-sm font-medium text-green-600 py-1 px-4 rounded-xl bg-gray-100" >{moment(item.start_date).format("MMM, YYYY")} - {moment(item.end_date).format("MMM, YYYY")}</p>
                                </div>
                                <p className="w-[80%] text-gray-400 " >{item.description}</p>
                                <div className="flex gap-5 items-center mt-2 ">
                                    <IconButton size="small" >
                                        <HiOutlinePencil className="text-blue-500" />
                                    </IconButton>
                                    <IconButton size="small">
                                        <RiDeleteBin6Line className="text-red-500" />
                                    </IconButton>
                                </div>
                            </div>
                        })}


                    </div>
                    {/* Project ends */}
                    {/* Skills start */}
                    <div className="flex w-full mt-16 justify-between">
                        <h3 className="mb-5 font-medium" >Skills</h3>
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
                    {/* <button className="bg-blue-500 text-white rounded-md py-3 mt-5 hover:shadow-md transition duration-200 hover:bg-blue-600 w-60" >Save</button> */}
                    {/* Skills ends */}
                </div>
            </div>
            <Modal open={educationModal} onClose={() => setEducationModal(false)} >
                <div className=" w-4/12 flex flex-col bg-white p-8 rounded-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 outline-none " >
                    <form onSubmit={handleSubmitEducation(handle_education)}>
                        <h3 className="font-semibold text-lg mb-4"  >Add education</h3>
                        <div className="flex flex-col gap-1 mb-2">
                            <label className="mb-1 font-normal" htmlFor="school">School/university</label>
                            <input className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" {...registerEducation("school")} id="school" placeholder="Enter school/university name" type="text" />
                        </div>
                        <div className="flex flex-col gap-1 mb-2" >
                            <label className="mb-1 font-normal" htmlFor="degree">Degree</label>
                            <input className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" {...registerEducation("degree")} id="degree" placeholder="Enter degree name" type="text" />
                        </div>
                        <div className="flex gap-4 mb-2">
                            <div className="flex flex-col gap-1 flex-1">
                                <label className="mb-1 font-normal" htmlFor="startDate">Start Date</label>
                                <input className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" {...registerEducation("startDate")} id="startDate" placeholder="Start name" type="date" />
                            </div>
                            <div className="flex flex-col gap-1 flex-1">
                                <label className="mb-1 font-normal" htmlFor="endDate">End Date</label>
                                <input className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" {...registerEducation("endDate")} id="endDate" placeholder="End name" type="date" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 mb-2" >
                            <label className="mb-1 font-normal" htmlFor="description">Description</label>
                            <textarea className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" {...registerEducation("description")} id="description" placeholder="Description" rows={5} />
                        </div>
                        <button type="submit" className="bg-blue-500 text-white rounded-md py-3 mt-5 hover:shadow-md transition duration-200 hover:bg-blue-600 w-full" >Add Education</button>
                    </form>
                </div>
            </Modal>
            <Modal open={workModal} onClose={() => setWorkModal(false)} >
                <div className=" w-4/12 flex flex-col bg-white p-8 rounded-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 outline-none " >
                    <form onSubmit={handleSubmitWorkExperience(handle_work_experience)} >
                        <h3 className="font-semibold text-lg mb-4"  >Add work experience</h3>
                        <div className="flex flex-col gap-1 mb-2">
                            <label className="mb-1 font-normal" htmlFor="company">Company</label>
                            <input className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" {...registerWorkExperience("company")} id="company" placeholder="Enter company name" type="text" />
                        </div>
                        <div className="flex flex-col gap-1 mb-2" >
                            <label className="mb-1 font-normal" htmlFor="jobTitle">Job title</label>
                            <input className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" {...registerWorkExperience("jobTitle")} id="jobTitle" placeholder="Enter job title" type="text" />
                        </div>
                        <div className="flex gap-4 mb-2">
                            <div className="flex flex-col gap-1 flex-1">
                                <label className="mb-1 font-normal" htmlFor="startDate">Start Date</label>
                                <input className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" {...registerWorkExperience("startDate")} id="startDate" placeholder="Start name" type="date" />
                            </div>
                            <div className="flex flex-col gap-1 flex-1">
                                <label className="mb-1 font-normal" htmlFor="endDate">End Date</label>
                                <input className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" {...registerWorkExperience("endDate")} id="endDate" placeholder="End name" type="date" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 mb-2" >
                            <label className="mb-1 font-normal" htmlFor="description">Description</label>
                            <textarea className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" {...registerWorkExperience("description")} id="description" placeholder="Description" rows={5} />
                        </div>
                        <button type="submit" className="bg-blue-500 text-white rounded-md py-3 mt-5 hover:shadow-md transition duration-200 hover:bg-blue-600 w-full" >Add work</button>
                    </form>
                </div>
            </Modal>
            <Modal open={projectModal} onClose={() => setProjectModal(false)} >
                <div className=" w-4/12 flex flex-col bg-white p-8 rounded-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 outline-none " >
                    <form onSubmit={handleSubmitProject(handle_project)} >
                        <h3 className="font-semibold text-lg mb-4"  >Add project</h3>
                        <div className="flex flex-col gap-1 mb-2">
                            <label className="mb-1 font-normal" htmlFor="projectName">Project name</label>
                            <input className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" {...registerProject("projectName")} id="projectName" placeholder="Enter project name" type="text" />
                        </div>
                        <div className="flex gap-4 mb-2">
                            <div className="flex flex-col gap-1 flex-1">
                                <label className="mb-1 font-normal" htmlFor="startDate">Start Date</label>
                                <input className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" {...registerProject("startDate")} id="startDate" placeholder="Start name" type="date" />
                            </div>
                            <div className="flex flex-col gap-1 flex-1">
                                <label className="mb-1 font-normal" htmlFor="endDate">End Date</label>
                                <input className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" {...registerProject("endDate")} id="endDate" placeholder="End name" type="date" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 mb-2" >
                            <label className="mb-1 font-normal" htmlFor="description">Description</label>
                            <textarea className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" {...registerProject("description")} id="description" placeholder="Description" rows={5} />
                        </div>
                        <button type="submit" className="bg-blue-500 text-white rounded-md py-3 mt-5 hover:shadow-md transition duration-200 hover:bg-blue-600 w-full" >Add project</button>
                    </form>
                </div>
            </Modal>
            <Modal open={changeResumeModal} onClose={() => setChangeResumeModal(false)}>
                <div className=" w-4/12 flex flex-col items-center bg-white p-8 rounded-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 outline-none " >
                    <h3 className="self-start font-semibold text-lg mb-4"  >Change resume</h3>
                    <p className="self-start text-blue-700" >{resumeTmp?.name}</p>
                    <div className='flex self-end mt-4 gap-4 justify-end items-center' >
                        <button onClick={() => setChangeResumeModal(false)} className="bg-white border border-blue-500 text-blue-500 rounded-md py-2 mt-5  transition duration-200  w-40" >Cancel</button>
                        <button onClick={() => handle_upload_resume()} className="bg-blue-500 text-white rounded-md py-2 mt-5 hover:shadow-md transition duration-200 hover:bg-blue-600 w-40" >Save</button>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    )
}

export default MyResume

type EducationFormData = {
    school: string,
    degree: string,
    startDate: Date,
    endDate: Date,
    description: string
}

type WorkExperienceFormData = {
    company: string,
    jobTitle: string,
    startDate: Date,
    endDate: Date,
    description: string
}


type ProjectFormData = {
    projectName: string,
    startDate: Date,
    endDate: Date,
    description: string
}