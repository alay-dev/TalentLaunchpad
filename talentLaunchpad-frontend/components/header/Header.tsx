import { Alert, Avatar, Checkbox, Drawer, IconButton, Modal, Popover, Tooltip } from "@mui/material"
import { useEffect, useState } from "react"
import { RiFacebookFill, RiLogoutCircleRLine } from "react-icons/ri"
import { CgGoogle } from "react-icons/cg"
import { AiOutlineUser } from "react-icons/ai"
import { FaUserTie } from "react-icons/fa"
import { IoCloseCircleOutline, IoLogOutOutline } from "react-icons/io5"
import Link from "next/link"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { emailLogin, logout, setAuth, signupWithEmail } from "@/slices/authentication/authenticationSlice"
import { useForm } from "react-hook-form"
import { useAppSelector } from "@/hooks/useAppSelector"
import { clearProfile, fetchUserProfile, updateInteractivityStatus } from "@/slices/user/userSlice"
import { useRouter } from "next/router"
import Image from "next/image"
import { Comfortaa } from "next/font/google"
import { TbTopologyStar } from "react-icons/tb"
import { CiViewTimeline } from "react-icons/ci"
import UNIVERSAL from "@/config/config"
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace"
import { HiOutlineChevronDown } from "react-icons/hi"
import { IoIosLogOut } from "react-icons/io"
import { BsChatSquareDots, BsCheck2All } from "react-icons/bs"
import { RxCross2 } from "react-icons/rx"
import { SlClose } from "react-icons/sl"

const comfortaa = Comfortaa({
    weight: ["500", "600", "700"],
    subsets: ["latin"]
})



const Header = () => {
    const [loginDrawer, setLoginDrawer] = useState(false)
    const [formType, setFormType] = useState("login");
    const [userType, setUserType] = useState("candidate");
    const [loginMessage, setLoginMessage] = useState("")
    const [profileMenu, setProfileMenu] = useState(false);
    const [profileMenuEl, setProfileMenuEl] = useState<Element>()
    const [interactivityStatusModal, setInteractivityStatusModal] = useState(false)

    const dispatch = useAppDispatch();
    const auth = useAppSelector(state => state.authentication)
    const user = useAppSelector(state => state.user.data)

    const router = useRouter()

    const { register: registerLogin, handleSubmit: handleSubmitLogin, formState: { errors: loginError } } = useForm<LoginFormData>({
        defaultValues: {
            userName: "",
            password: "",
        }
    })

    const { register: registerSignup, handleSubmit: handleSubmitSignup, formState: { errors: signupError }, getValues: getSignupValues } = useForm<SignupFormData>({
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",

        }
    })


    useEffect(() => {
        if (!auth?.data?.token && sessionStorage.getItem("TALENTLAUNCHPAD_TOKEN")) {
            dispatch(fetchUserProfile({ token: sessionStorage.getItem("TALENTLAUNCHPAD_TOKEN")! })).unwrap()
                .then(res => dispatch(setAuth({
                    token: sessionStorage.getItem("TALENTLAUNCHPAD_TOKEN"),
                    user: res
                })))
        } else if (!auth?.data?.token && !sessionStorage.getItem("TALENTLAUNCHPAD_TOKEN")) {
            router.push("/")
        }

    }, [auth?.data?.token])

    useEffect(() => {
        if (auth.data.token) {
            dispatch(fetchUserProfile({ token: auth.data.token }))
        }
    }, [auth?.data?.token])

    const login = (data: LoginFormData) => {
        dispatch(emailLogin({ email: data.userName, password: data.password })).unwrap()
            .then(() => { setLoginDrawer(false); })
            .catch((err) => setLoginMessage(err.message))
    }

    const signup = (data: SignupFormData) => {
        dispatch(signupWithEmail({
            name: data.fullName,
            email: data.email,
            password: data.password,
            userType: userType
        })).unwrap()
            .then(res => dispatch(emailLogin({ email: data.email, password: data.password })
            ).unwrap()
                .then(() => { console.log("SUCCESS LOGIN"); setLoginDrawer(false) }))
    }

    const handle_logout = () => {

        setProfileMenu(false)
        dispatch(logout());
        dispatch(clearProfile());

        sessionStorage.removeItem("TALENTLAUNCHPAD_TOKEN");
        router.push("/")
    }

    const handle_status_update = (status: string) => {
        dispatch(updateInteractivityStatus({
            token: auth.data?.token,
            status: status
        })).unwrap()
            .then(() => { setInteractivityStatusModal(false); dispatch(fetchUserProfile({ token: auth?.data?.token })) })
    }

    return (
        <>
            <div className={`bg-white shadow-md w-full h-[var(--header-height)] px-10 py-4 flex items-center justify-between fixed top-0 left-0 z-10`} >
                <div >
                    <Link href="/" >
                        <div className="flex gap-2 items-center" >
                            <CiViewTimeline className="text-3xl" />
                            <h3 className={`text-blue-800 font-bold text-lg ${comfortaa.className} m-0 p-0 `} >Talent Launchpad</h3>
                        </div>
                        {/* <Image width={200} height={100} alt="Talent launchpad" src={"/assets/logo.svg"} /> */}
                    </Link>
                </div >
                <div className="flex items-center" >
                    <ul className="flex gap-2 items-center" >
                        <Link href="/search_jobs">
                            <li className="self-stretch text-gray-600 transition-all duration-75 py-1 px-2 rounded-md hover:bg-slate-200 cursor-pointer">Find Jobs</li>
                        </Link>
                        {auth.data.token &&
                            <>

                                <li onClick={(e) => { setProfileMenuEl(e.currentTarget); setProfileMenu(true) }} className="self-stretch flex gap-1 items-center transition-all duration-75 py-1 px-2 rounded-md hover:bg-slate-200 cursor-pointer text-gray-600">
                                    <Avatar src={`${UNIVERSAL.BASEURL}/profilePic/${auth?.data?.user?.avatar}`} sx={{ width: "2rem", height: "2rem" }} />
                                    <HiOutlineChevronDown />
                                </li>


                                {/* <li className="self-stretch text-gray-600 flex gap-1 items-center transition-all duration-75 py-1 px-2 rounded-md hover:bg-slate-200 cursor-pointer" onClick={() => handle_logout()}>
                                    <RiLogoutCircleRLine className="text-lg" />
                                    <p>Logout</p>
                                </li> */}

                            </>
                        }
                        {!auth.data.token &&
                            <li>

                                <button onClick={() => setLoginDrawer(true)} className="hover:border-blue-700 hover:bg-blue-700 hover:shadow-md hover:text-white transition-all duration-100 border-2 px-6 py-2 rounded-md  border-black text-sm" >Login / Register</button>
                            </li>
                        }
                    </ul>

                </div>
            </div>
            <Popover
                open={profileMenu}
                anchorEl={profileMenuEl}
                onClose={() => setProfileMenu(false)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
            >
                <ul className="w-72 m-0 p-4 py-6 min-w-max"  >
                    <li className="flex items-center gap-4 border-b border-gray-200 pb-4 mb-2">
                        <Avatar className="rounded-full overflow-hidden" alt={auth?.data?.user?.name} src={`${UNIVERSAL.BASEURL}/profilePic/${auth?.data?.user?.avatar}`} />
                        <div>
                            <h5 className="font-bold">{auth?.data?.user?.name}</h5>
                            {user?.user_type === "candidate" &&
                                <div className="flex gap-8">
                                    <p className="text-sm">{user?.interactivity_status}</p>
                                    <p className="text-sm text-blue-600 cursor-pointer" onClick={() => { setInteractivityStatusModal(true); setProfileMenu(false) }} >Change</p>
                                </div>}
                        </div>
                    </li>
                    {auth?.data?.user?.user_type === "employer" && <Link href="/company_profile"> <li className="cursor-pointer text-sm py-1 px-2 rounded-md hover:bg-gray-200">Company</li></Link>}
                    <Link href="/my_profile"> <li className="cursor-pointer text-sm py-1 px-2 rounded-md hover:bg-gray-200">My Profile</li></Link>
                    {auth?.data?.user?.user_type === "candidate" && <Link href="/my_resume"> <li className="cursor-pointer text-sm py-1 px-2 rounded-md hover:bg-gray-200">Resume</li></Link>}
                    {auth?.data?.user?.user_type === "candidate" && <Link href="/post_new_job"><li className="cursor-pointer text-sm py-1 px-2 rounded-md hover:bg-gray-200">Post a job</li></Link>}
                    {auth?.data?.user?.user_type === "candidate" && <Link href="/applied_jobs"><li className="cursor-pointer text-sm py-1 px-2 rounded-md hover:bg-gray-200">Applied jobs</li></Link>}
                    {auth?.data?.user?.user_type === "employer" && <Link href="/manage_jobs"><li className="cursor-pointer text-sm py-1 px-2 rounded-md hover:bg-gray-200">Manage jobs</li></Link>}
                    <div className="my-2 w-full h-[1px] bg-gray-200" />
                    <li className="cursor-pointer text-sm py-1 px-2 rounded-md hover:bg-gray-200">Help</li>
                    <li onClick={() => handle_logout()} className="mt-1 text-red-600 bg-gray-100 flex gap-1 items-center justify-center cursor-pointer text-sm py-2 px-2 rounded-md hover:bg-gray-200">
                        <IoIosLogOut className="text-lg" />
                        Log out
                    </li>

                </ul>
            </Popover>
            <Drawer
                anchor="right"
                open={loginDrawer}
                onClose={() => setLoginDrawer(!loginDrawer)}
            >
                <div className="py-8 px-12  w-[28rem] h-full bg-white relative " >
                    <div className="absolute top-3 left-3">
                        <IconButton onClick={() => setLoginDrawer(false)} >
                            <IoCloseCircleOutline />
                        </IconButton>
                    </div>
                    {formType === "login" &&
                        <>
                            <form className="mb-5 flex flex-col" onSubmit={handleSubmitLogin(login)} >
                                <h2 className=" text-center mb-8 text-2xl text-gray-950 font-normal">Login to Talent Launchpad</h2>
                                {loginMessage && <Alert className="mb-3" variant="filled" severity={"error"}  >{loginMessage}</Alert>}
                                <label className="mb-1 font-medium" htmlFor="userName">Username</label>
                                <input className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" id="userName" {...registerLogin("userName", { required: { value: true, message: "*Please provide email" } })} placeholder="username" type="email" />
                                {loginError.userName &&
                                    <p className="text-red-500 mt-3" >{loginError.userName.message}</p>
                                }
                                <label className="mt-5 mb-1 font-medium" htmlFor="password">Password</label>
                                <input className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" id="password" {...registerLogin("password", { required: { value: true, message: "*Please provide password" } })} placeholder="Password" type="password" />
                                {loginError.password &&
                                    <p className="text-red-500 mt-3" >{loginError.password.message}</p>
                                }
                                <div className="mt-5 flex justify-between items-center">
                                    <div className="cursor-pointer flex items-center gap-2">
                                        <Checkbox sx={{ margin: 0, padding: 0 }} />
                                        <p className="text-gray-500" >Remember me</p>
                                    </div>
                                    <p className="cursor-pointer" >Forgot password?</p>
                                </div>
                                <button className="bg-blue-500 text-white rounded-md py-3 mt-5 hover:shadow-md transition duration-200 hover:bg-blue-600" >Log in</button>
                            </form>
                            <p className="text-center text-sm">Don&apos;t have an account? <b onClick={() => setFormType("signup")} className="text-gray-500 cursor-pointer">Signup</b></p>
                            <div className="mt-4 flex items-center gap-3">
                                <div className="flex-1 h-0.5 bg-gray-300" />
                                <p className="text-gray-500 text-sm" >or</p>
                                <div className="flex-1 h-0.5 bg-gray-300" />
                            </div>
                            <div className="mt-5 flex items-center gap-5">
                                <button className=" hover:bg-blue-700 hover:text-white flex text-blue-700 items-center gap-1 rounded-md py-3 px-3 border border-blue-700 " >
                                    <RiFacebookFill />
                                    <p className="text-sm">Login with facebook</p>
                                </button>
                                <button className=" hover:bg-red-600 hover:text-white flex text-red-600 items-center gap-1 rounded-md py-3 px-3 border border-red-600 " >
                                    <CgGoogle />
                                    <p className="text-sm">Login with google</p>
                                </button>

                            </div>
                        </>
                    }
                    {formType === "signup" &&
                        <>
                            <form className="mb-5 flex flex-col" onSubmit={handleSubmitSignup(signup)}>
                                <h2 className=" text-center mb-8 text-2xl text-gray-950 font-normal">Sign up to Talent Launchpad</h2>
                                <div className="flex gap-4 items-center justify-center mb-5 ">
                                    <button type="button" onClick={() => setUserType("candidate")} className={` self-center flex gap-1 items-center ${userType === "candidate" ? "bg-red-500 text-white shadow-md" : "bg-gray-200 text-blue-500"}  py-2 px-4 rounded-md`} >
                                        <AiOutlineUser />
                                        <p>Candidate</p>
                                    </button>
                                    <button type="button" onClick={() => setUserType("employer")} className={`self-center flex gap-1 items-center ${userType === "employer" ? "bg-blue-500 text-white shadow-md" : "bg-gray-200 text-blue-500"}  py-2 px-4 rounded-md`} >
                                        <FaUserTie />
                                        <p>Employer</p>
                                    </button>
                                </div>
                                <label className="mb-1 font-medium" htmlFor="Full Name">Full Name</label>
                                <input className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" id="Full Name" {...registerSignup("fullName", { required: { value: true, message: "Please provide us your name" } })} placeholder="Full Name" type="text" />
                                {signupError.fullName &&
                                    <p className="text-red-500 mt-3" >{signupError.fullName.message}</p>
                                }
                                <label className="mb-1 mt-3 font-medium" htmlFor="Email">Email</label>
                                <input className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" id="Email"  {...registerSignup("email", { required: { value: true, message: "Please provide us your email" } })} placeholder="Email" type="email" />
                                {signupError.email &&
                                    <p className="text-red-500 mt-3" >{signupError.email.message}</p>
                                }
                                <label className="mt-3 mb-1 font-medium" htmlFor="password">Password</label>
                                <input className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" id="password"  {...registerSignup("password", { required: { value: true, message: "Please enter a password" } })} placeholder="Password" type="password" />
                                {signupError.password &&
                                    <p className="text-red-500 mt-3" >{signupError.password.message}</p>
                                }
                                <label className="mt-3 mb-1 font-medium" htmlFor="confirmPassword">Confirm Password</label>
                                <input className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" id="confirmPassword"  {...registerSignup("confirmPassword", { required: true, validate: () => getSignupValues("confirmPassword") === getSignupValues("password") })} placeholder="Confrm Password" type="password" />
                                {signupError.confirmPassword && signupError.confirmPassword.type === "validate" &&
                                    <p className="text-red-500 mt-3" >Confirm password doesn&apos;t match the New password</p>
                                }
                                <button className="bg-blue-500 text-white rounded-md py-3 mt-5 hover:shadow-md transition duration-200 hover:bg-blue-600" >Register</button>
                            </form>
                            <p className="text-center text-sm">Already have an account? <b onClick={() => setFormType("login")} className="text-gray-500 cursor-pointer">Login</b></p>


                        </>
                    }
                </div>
            </Drawer >
            <Modal open={interactivityStatusModal} onClose={() => setInteractivityStatusModal(false)} >
                <div className=" w-4/12 flex flex-col  bg-white p-8 rounded-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 outline-none " >
                    <h3 className="font-medium text-xl mb-5" >Select your status</h3>
                    <ul>
                        <li onClick={() => handle_status_update("Ready to interview")} className="flex gap-4 mb-3 hover:bg-gray-100 rounded-md p-1 cursor-pointer ">
                            <BsChatSquareDots className="text-5xl text-green-500" />
                            <div>
                                <h5 className="font-medium" >Ready to interview</h5>
                                <p className="leading-5 text-gray-500">You’re actively looking for new work and ready to interview. Your job profile will be visible to startups.</p>
                            </div>
                        </li>
                        <li onClick={() => handle_status_update("Open to offers")} className=" flex gap-4 mb-3 hover:bg-gray-100 rounded-md p-1 cursor-pointer ">
                            <BsCheck2All className="text-5xl text-blue-500" />
                            <div>
                                <h5 className="font-medium">Open to offers</h5>
                                <p className="leading-5 text-gray-500">You’re not looking but open to hear about new opportunities. Your job profile will be visible to startups.</p>
                            </div>
                        </li>
                        <li onClick={() => handle_status_update("Closed to offers")} className="flex gap-4 hover:bg-gray-100 rounded-md p-1 cursor-pointer" >
                            <SlClose className="text-5xl text-red-500" />
                            <div>
                                <h5 className="font-medium">Closed to offers</h5>
                                <p className="leading-5 text-gray-500">You’re not looking and don’t want to hear about new opportunities. Your job profile will be hidden to startups.</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </Modal>
        </>
    )
}

export default Header

type LoginFormData = {
    userName: string,
    password: string
}

type SignupFormData = {
    fullName: string,
    email: string,
    password: string,
    confirmPassword: string
}