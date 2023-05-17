import { useState, useEffect, ReactNode } from "react"
import Header from "@/components/header/Header"
import { RxDashboard } from "react-icons/rx"
import { HiOutlineUser, HiOutlineBriefcase } from "react-icons/hi"
import { CgFileDocument } from "react-icons/cg"
import { SlLock } from "react-icons/sl"
import { RiLogoutCircleRLine } from "react-icons/ri"
import { BiMessageSquareDetail } from "react-icons/bi"
import { RxPaperPlane } from "react-icons/rx"

import { useRouter } from "next/router"
import Link from "next/link"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { fetchUserProfile } from "@/slices/user/userSlice"
import { setAuth } from "@/slices/authentication/authenticationSlice"
import { useAppSelector } from "@/hooks/useAppSelector"

type DashboardLayoutProps = {
    children?: ReactNode
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    const [activePage, setActivePage] = useState("dashboard");
    const router = useRouter();
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.user.data)



    useEffect(() => {
        if (sessionStorage.getItem("TALENTLAUNCHPAD_TOKEN")) {
            dispatch(fetchUserProfile({ token: sessionStorage.getItem("TALENTLAUNCHPAD_TOKEN")! })).unwrap()
                .then(res => dispatch(setAuth({
                    token: sessionStorage.getItem("TALENTLAUNCHPAD_TOKEN"),
                    user: res
                })))
        } else {
            router.push("/")
        }

    }, [])

    // useEffect(() => {
    //     console.log(router.pathname)
    //     if (router.pathname === "/dashboard") setActivePage("dashboard")
    //     else if (router.pathname === "/my_profile") setActivePage("myProfile")
    //     else if (router.pathname === "/my_resume") setActivePage("myResume")
    // }, [router.pathname])

    return (
        <>
            <Header />
            <div className="bg-gray-100 min-h-screen pt-[var(--header-height)] flex relative">
                <div className="py-10 px-4 bg-white w-[var(--dashboard-side-menu-width)] h-full shadow-[0_6px_15px_rgba(64,79,104,.05)] fixed top-[var(--header-height)] left-0">
                    <ul className="w-full flex flex-col gap-1 " >
                        {/* <Link href="/dashboard">
                            <li onClick={() => setActivePage("dashboard")} className={` transition duration-150 cursor-pointer ${router.pathname === "/dashboard" ? "text-blue-500 bg-gray-100" : ""} hover:bg-gray-100 py-2 px-4 font-light flex gap-4 items-center rounded-md w-full `} >
                                <RxDashboard className="text-xl" />
                                <p>Dashboard</p>
                            </li>
                        </Link> */}
                        {user?.user_type === "employer" &&
                            <Link href="/company_profile">
                                <li onClick={() => setActivePage("companyProfile")} className={` ${router.pathname === "/company_profile" ? "text-blue-500 bg-gray-100" : ""} hover:bg-gray-100 py-2 px-4 font-light flex gap-4 items-center rounded-md w-full cursor-pointer transition duration-150 `} >
                                    <HiOutlineUser className="text-xl" />
                                    <p>Company Profile</p>
                                </li>
                            </Link>
                        }
                        {user?.user_type === "employer" &&
                            <Link href="/post_new_job">
                                <li onClick={() => setActivePage("postNewJob")} className={` ${router.pathname === "/post_new_job" ? "text-blue-500 bg-gray-100" : ""} hover:bg-gray-100 py-2 px-4 font-light flex gap-4 items-center rounded-md w-full cursor-pointer transition duration-150 `} >
                                    <RxPaperPlane className="text-xl" />
                                    <p>Post a new job</p>
                                </li>
                            </Link>
                        }
                        {user?.user_type === "employer" &&
                            <Link href="/manage_jobs">
                                <li onClick={() => setActivePage("manageJobs")} className={` ${router.pathname === "/manage_jobs" ? "text-blue-500 bg-gray-100" : ""} hover:bg-gray-100 py-2 px-4 font-light flex gap-4 items-center rounded-md w-full cursor-pointer transition duration-150 `} >
                                    <HiOutlineBriefcase className="text-xl" />
                                    <p>Manage jobs</p>
                                </li>
                            </Link>
                        }
                        {user?.user_type === "candidate" &&
                            <Link href="/my_profile">
                                <li onClick={() => setActivePage("myProfile")} className={` ${router.pathname === "/my_profile" ? "text-blue-500 bg-gray-100" : ""} hover:bg-gray-100 py-2 px-4 font-light flex gap-4 items-center rounded-md w-full cursor-pointer transition duration-150 `} >
                                    <HiOutlineUser className="text-xl" />
                                    <p>My profile</p>
                                </li>
                            </Link>
                        }
                        {user?.user_type === "candidate" &&
                            <Link href="/my_resume">
                                <li onClick={() => setActivePage("myResume")} className={` ${router.pathname === "/my_resume" ? "text-blue-500 bg-gray-100" : ""} hover:bg-gray-100 py-2 px-4 font-light flex gap-4 items-center rounded-md w-full cursor-pointer transition duration-150 `} >
                                    <CgFileDocument className="text-xl" />
                                    <p>My resume</p>
                                </li>
                            </Link>
                        }
                        {user?.user_type === "candidate" &&
                            <Link href="/applied_jobs">
                                <li onClick={() => setActivePage("appliedJobs")} className={` ${router.pathname === "/applied_jobs" ? "text-blue-500 bg-gray-100" : ""} hover:bg-gray-100 py-2 px-4 font-light flex gap-4 items-center rounded-md w-full cursor-pointer transition duration-150 `} >
                                    <HiOutlineBriefcase className="text-xl" />
                                    <p>Applied jobs</p>
                                </li>
                            </Link>
                        }
                        <li onClick={() => setActivePage("messages")} className={` ${router.pathname === "/messages" ? "text-blue-500 bg-gray-100" : ""} hover:bg-gray-100 py-2 px-4 font-light flex gap-4 items-center rounded-md w-full cursor-pointer transition duration-150 `} >
                            <BiMessageSquareDetail className="text-xl" />
                            <p>Messages</p>
                        </li>
                        <Link href="/change_password">
                            <li onClick={() => setActivePage("changePassword")} className={` ${router.pathname === "/change_password" ? "text-blue-500 bg-gray-100" : ""} hover:bg-gray-100 py-2 px-4 font-light flex gap-4 items-center rounded-md w-full cursor-pointer transition duration-150 `} >
                                <SlLock className="text-xl" />
                                <p>Change password</p>
                            </li>
                        </Link>

                        {/* <li onClick={() => setActivePage("changePassword")} className={` hover:bg-gray-100 py-2 px-4 font-light flex gap-4 items-center rounded-md w-full cursor-pointer transition duration-150 `} >
                            <RiLogoutCircleRLine className="text-xl" />
                            <p>Logout</p>
                        </li> */}

                    </ul>
                </div>
                <div className="py-10 px-6 ml-[var(--dashboard-side-menu-width)] w-full" >
                    {children}
                </div>
            </div >
        </>
    )
}

export default DashboardLayout