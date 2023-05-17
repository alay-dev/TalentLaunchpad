import DashboardLayout from "@/components/dashboardLayout/DashboardLayout"
import { useAppSelector } from "@/hooks/useAppSelector"
import Image from "next/image"
import dynamic from "next/dynamic";
import { HiOutlineEye, HiPencil } from "react-icons/hi"
import { useForm } from "react-hook-form"
import { useRouter } from 'next/router';
import { useEffect, useState } from "react"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { changeProfilePic, fetchUserProfile, updateUserProfile } from "@/slices/user/userSlice"
import { Alert, AlertColor, Modal, Snackbar } from "@mui/material"
import UNIVERSAL from "@/config/config"
const Editor = dynamic(() => import("@/components/editor/Editor"), { ssr: false });

const Profile = () => {
    const [bio, setBio] = useState("")
    const [changeAvatarModal, setChangeAvatarModal] = useState(false)
    const [avatarTmp, setAvatarTmp] = useState<any>(null)
    const [updateProfileMessage, setUpdateProfileMessage] = useState<{ severity: string, message: string }>({ severity: "", message: "" })

    const user = useAppSelector(state => state.user.data)
    const auth = useAppSelector(state => state.authentication)
    const router = useRouter();
    const dispatch = useAppDispatch()

    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<updateProfileData>();

    const update_profile = (data: updateProfileData) => {
        dispatch(updateUserProfile({
            ...data,
            bio: bio,
            token: auth.data.token
        })).unwrap()
            .then(() => { dispatch(fetchUserProfile({ token: auth.data.token })); setUpdateProfileMessage({ severity: "success", message: "Profile updated" }) })
            .catch(err => setUpdateProfileMessage({ severity: "error", message: err.message }))
    }

    useEffect(() => {
        setBio(user?.bio)
    }, [user.bio])

    useEffect(() => {
        reset({
            name: user.name,
            phone: user.phone,
            email: user.email,
            website: user.website,
            currentSalary: user.current_salary,
            expectedSalary: user.expected_salary,
            experience: user.experience,
            age: user.age,
            githubLink: user.github_link,
            linkedinLink: user.linkedin_link,
            twitterLink: user.twitter_link,
            facebookLink: user.facebook_link
        });
    }, [user]);

    const handle_avatar_change = (files: FileList | null) => {
        if (files?.length) {
            setAvatarTmp(files[0])
            setChangeAvatarModal(true)
        }
    }

    const handle_upload_avatar = () => {
        dispatch(changeProfilePic({ token: auth.data.token, avatar: avatarTmp }))
            .unwrap()
            .then(() => {
                dispatch(fetchUserProfile({ token: auth.data.token }));
                setChangeAvatarModal(false);
                setUpdateProfileMessage({ severity: "success", message: "Profile picture updated" })
            })
            .catch(err => setUpdateProfileMessage({ severity: "error", message: err.message }))
    }

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setUpdateProfileMessage({ severity: "", message: "" });
    };

    return (
        <DashboardLayout>
            <div className="w-full">
                <div className="flex justify-between items-center">
                    <h1 className='font-medium text-3xl '>My Profile</h1>
                    <button className=" flex gap-1 items-center bg-blue-500 text-white rounded-md py-2 px-3 text-sm mt-5 hover:shadow-md transition duration-200 hover:bg-blue-600" onClick={() => router.push(`/user/${user?.id}`)}>
                        <HiOutlineEye className="text-lg" />
                        See public profile
                    </button>
                </div>

                <div className="bg-white rounded-lg mt-8 shadow-[0_6px_15px_rgba(64,79,104,.05)]   p-5">
                    <div className=" relative w-36 h-36 rounded-full flex justify-center items-center"  >
                        <Image alt="avatar" className="object-cover rounded-full " fill src={user?.avatar ? `${UNIVERSAL.BASEURL}/profilePic/${user.avatar}` : "/assets/avatar.png"} />
                        <div>
                            <label className="cursor-pointer shadow-sm hover:shadow-md  rounded-full p-2 bg-blue-500 text-white  absolute bottom-0 right-0" htmlFor="avatar"><HiPencil className="text-lg" /></label>
                            <input className="hidden" id="avatar" type="file" onChange={(e) => handle_avatar_change(e.target.files)} />

                        </div>
                    </div>
                    <form onSubmit={handleSubmit(update_profile)} className="mt-7 pt-8 border-t" >

                        <div className="flex gap-5 mb-5">
                            <div className="flex flex-col w-1/2">
                                <label className="mb-1 font-medium" htmlFor="name">Full Name</label>
                                <input className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" {...register("name")} id="name" placeholder="Full Name" type="text" />
                            </div>
                            <div className="flex flex-col w-1/2">
                                <label className="mb-1 font-medium" htmlFor="gender">Gender</label>
                                <select className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" {...register("gender")} id="gender" >
                                    <option value="Male" >Male</option>
                                    <option value="Female" >Female</option>
                                    <option value="Other" >Other</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-5 mb-5">
                            <div className="flex flex-col w-1/2">
                                <label className="mb-1 font-medium" htmlFor="Phone">Phone</label>
                                <input className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" {...register("phone")} id="Phone" placeholder="Phone" type="text" />
                            </div>
                            <div className="flex flex-col w-1/2">
                                <label className="mb-1 font-medium" htmlFor="Email">Email</label>
                                <input className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" {...register("email")} id="Email" placeholder="Email" type="email" readOnly />
                            </div>
                        </div>
                        <div className="flex gap-5 mb-5">
                            <div className="flex flex-col w-1/2">
                                <label className="mb-1 font-medium" htmlFor="Website">Website</label>
                                <input className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" {...register("website")} id="Website" placeholder="Website" type="text" />
                            </div>
                            <div className="flex gap-5 w-1/2 ">
                                <div className="flex flex-col w-1/2">
                                    <label className="mb-1 font-medium" htmlFor="Current Salary">Current Salary(Rs)</label>
                                    <input className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" {...register("currentSalary")} id="Current Salary" placeholder="Current Salary" />
                                </div>
                                <div className="flex flex-col w-1/2">
                                    <label className="mb-1 font-medium" htmlFor="Expected Salary">Expected Salary(Rs)</label>
                                    <input className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" {...register("expectedSalary")} id="Expected Salary" placeholder="Expected Salary" />
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-5 mb-5">
                            <div className="flex flex-col w-1/2">
                                <label className="mb-1 font-medium" htmlFor="Experience">Experience</label>
                                <input className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" {...register("experience")} id="Experience" placeholder="Experience" type="text" />
                            </div>
                            <div className="flex flex-col w-1/2">
                                <label className="mb-1 font-medium" htmlFor="Age">Age</label>
                                <input className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" {...register("age")} id="Age" placeholder="Age" />
                            </div>
                        </div>
                        <div className="flex flex-col w-full">
                            <label className="mb-1 font-medium" htmlFor="bio">About you</label>
                            <Editor
                                value={bio}
                                onChange={(v: any) => setBio(v)}
                            />
                        </div>
                        <div className="flex gap-5 mb-5 mt-4">
                            <div className="flex flex-col w-1/2">
                                <label className="mb-1 font-medium" htmlFor="Linkedin">Linkedin</label>
                                <input className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" {...register("linkedinLink")} id="Linkedin" placeholder="Linkedin" type="text" />
                            </div>
                            <div className="flex flex-col w-1/2">
                                <label className="mb-1 font-medium" htmlFor="Github">Github</label>
                                <input className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" {...register("githubLink")} id="Github" placeholder="Github" />
                            </div>
                        </div>
                        <div className="flex gap-5 ">
                            <div className="flex flex-col w-1/2">
                                <label className="mb-1 font-medium" htmlFor="Twitter">Twitter</label>
                                <input className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" {...register("twitterLink")} id="Twitter" placeholder="Twitter" type="text" />
                            </div>
                            <div className="flex flex-col w-1/2">
                                <label className="mb-1 font-medium" htmlFor="Facebook">Facebook</label>
                                <input className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" {...register("facebookLink")} id="Facebook" placeholder="Facebook" />
                            </div>
                        </div>
                        <button type="submit" className="bg-blue-500 text-white rounded-md py-3 mt-5 hover:shadow-md transition duration-200 hover:bg-blue-600 w-60" >Save</button>
                    </form>
                </div>
            </div>
            <Modal open={changeAvatarModal} onClose={() => setChangeAvatarModal(false)}>
                <div className=" w-4/12 flex flex-col items-center bg-white p-8 rounded-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 outline-none " >
                    <h3 className="self-start font-semibold text-lg mb-4"  >Change profile picture</h3>
                    {avatarTmp &&
                        <Image alt="avatar" className="rounded-lg overflow-hidden" width={200} height={200} src={URL.createObjectURL(avatarTmp)} />
                    }
                    <div className='flex self-end mt-4 gap-4 justify-end items-center' >
                        <button onClick={() => setChangeAvatarModal(false)} className="bg-white border border-blue-500 text-blue-500 rounded-md py-2 mt-5  transition duration-200  w-40" >Cancel</button>
                        <button onClick={() => handle_upload_avatar()} className="bg-blue-500 text-white rounded-md py-2 mt-5 hover:shadow-md transition duration-200 hover:bg-blue-600 w-40" >Save</button>
                    </div>
                </div>
            </Modal>
            <Snackbar anchorOrigin={{ vertical: "top", horizontal: "center" }} open={Boolean(updateProfileMessage.message)} autoHideDuration={6000} onClose={handleClose}>
                <Alert variant='filled' severity={updateProfileMessage.severity as AlertColor} onClose={handleClose} sx={{ width: '100%' }}>
                    {updateProfileMessage.message}
                </Alert>
            </Snackbar>
        </DashboardLayout >
    )
}

export default Profile

type updateProfileData = {
    // bio: string,
    email: string,
    phone: string,
    resume: string,
    name: string,
    website: string,
    currentSalary: string,
    expectedSalary: string,
    age: number,
    experience: string,
    linkedinLink: string,
    githubLink: string,
    twitterLink: string,
    facebookLink: string,
    gender: string
}