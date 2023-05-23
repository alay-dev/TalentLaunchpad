import DashboardLayout from '@/components/dashboardLayout/DashboardLayout'
import UNIVERSAL from '@/config/config'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useAppSelector } from '@/hooks/useAppSelector'
import { getAppliedJobs } from '@/slices/job/jobSlice'
import { Avatar, Drawer, IconButton } from '@mui/material'
import moment from 'moment'
import React, { FormEvent, useEffect, useState } from 'react'
import { BsArrowRight } from 'react-icons/bs'
import { IoCloseOutline } from 'react-icons/io5'
import Image from "next/image"
import { getAllCandidateConversation, getAllEmployerConversation, getChat, sendMessage } from '@/slices/message/messageSlice'

const Messages = () => {
    const [messageDrawer, setMessageDrawer] = useState(false);
    const [currentChat, setCurrentChat] = useState<any>("")
    const [text, setText] = useState("");

    const auth = useAppSelector(state => state.authentication.data)
    const user = useAppSelector(state => state.user.data)
    const appliedJobs = useAppSelector(state => state.job.appliedJobs)
    const message = useAppSelector(state => state.message)

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (auth?.token && auth?.user?.user_type === "candidate") {
            dispatch(getAllCandidateConversation({ token: auth.token }))
        } else if (auth?.token && auth?.user?.user_type === "employer") {
            dispatch(getAllEmployerConversation({ token: auth.token, companyId: auth.user.company_id }))
        }
    }, [auth.token])

    const handle_get_chat = (item: any) => {
        setMessageDrawer(true);
        setCurrentChat(item);

        if (auth.user.user_type === "candidate") {
            dispatch(getChat({ companyId: item?.company_id, token: auth.token, userId: auth.user.id }))
        } else {
            dispatch(getChat({ companyId: auth?.user?.company_id, token: auth.token, userId: item?.user_id }))
        }


    }

    const handle_send_message = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (auth?.user?.user_type === "candidate") {
            dispatch(sendMessage({
                fromUser: user?.id,
                toCompany: currentChat?.company_id,
                fromCompany: null,
                toUser: null,
                message: text,
                token: auth?.token
            })).unwrap()
                .then(() => { setText(""); dispatch(getChat({ companyId: currentChat?.company_id, token: auth.token, userId: auth.user.id })) })
        } else {
            dispatch(sendMessage({
                fromUser: null,
                toCompany: null,
                fromCompany: auth?.user?.company_id,
                toUser: currentChat?.user_id,
                message: text,
                token: auth?.token
            })).unwrap()
                .then(() => { setText(""); dispatch(getChat({ companyId: auth?.user?.company_id, token: auth?.token, userId: currentChat?.user_id })) })
        }
    }


    return (
        <DashboardLayout>
            <div className="w-full">
                <h1 className='font-medium text-3xl '>Messages</h1>
                <div className=" flex flex-col gap-6 bg-white rounded-lg mt-8 shadow-[0_6px_15px_rgba(64,79,104,.05)]   p-5">
                    {message?.allConversation?.map(item => {
                        return <div onClick={() => handle_get_chat(item)} className='cursor-pointer flex gap-6 p-5 rounded-md border hover:shadow-md' >
                            <div className='relative w-16 h-16 border rounded-sm'>
                                {auth.user.user_type === "candidate" ?
                                    <Image fill={true} alt="company logo" src={`${UNIVERSAL.BASEURL}/company/${item?.company_logo}`} /> :
                                    <Image fill={true} alt="user avatar" src={`${UNIVERSAL.BASEURL}/profilePic/${item?.avatar}`} />}
                            </div>
                            <div className='flex justify-between flex-1' >
                                <div >
                                    <h2 className='font-semibold text-xl'>{auth.user.user_type === "candidate" ? item?.company_name : item?.user_name}</h2>
                                    <p className='text-gray-500 text-sm'><strong className='text-gray-600 text-base font-medium'>Alay Naru</strong> {moment().format("LL")}</p>
                                    {/* <p className='text-gray-400'>I will submit it by 26 EOD</p> */}
                                </div>
                                <BsArrowRight className='text-xl text-gray-500' />
                            </div>
                        </div>
                    })}

                </div>
            </div>
            <Drawer
                anchor={"right"}
                open={messageDrawer}
                onClose={() => setMessageDrawer(false)}
            >
                <div className='w-[35rem] flex flex-col h-full'>
                    <div className='flex gap-6 p-6 border-b '>
                        <div className='relative border rounded-sm w-16 h-16'>
                            {auth.user.user_type === "candidate" ?
                                <Image fill={true} alt="company logo" src={`${UNIVERSAL.BASEURL}/company/${currentChat?.company_logo}`} /> :
                                <Image fill={true} alt="user avatar" src={`${UNIVERSAL.BASEURL}/profilePic/${currentChat?.avatar}`} />}
                        </div>
                        <div className='flex justify-between flex-1 items-start ' >
                            <div>
                                <h3 className='font-semibold text-xl mb-1'>{auth.user.user_type === "candidate" ? currentChat?.company_name : currentChat?.user_name}</h3>
                                <p>Enable eCommerce for insurance</p>
                            </div>
                            <IconButton onClick={() => setMessageDrawer(false)}>
                                <IoCloseOutline className='text-2xl text-gray-600' />
                            </IconButton>
                        </div>

                    </div>
                    <div className='flex-1 flex flex-col gap-3 p-3 w-full overflow-auto ck-block-toolbar-button ' >
                        {/*  */}
                        {message?.data?.map((item: any) => {
                            if (auth.user.user_type === "candidate") {
                                if (item?.from_user) {
                                    return <div className='self-end flex flex-col'>
                                        <div className='flex gap-2 items-end'>
                                            <div className='rounded-t-lg rounded-bl-lg bg-blue-600 text-white  w-80 p-3' >
                                                <p>{item.message}</p>

                                            </div>
                                            <Avatar src={`${UNIVERSAL.BASEURL}/profilePic/${user?.avatar}`} sx={{ width: "2rem", height: "2rem" }} />
                                        </div>

                                        <div className='self-end'>
                                            <h4 className='font-semibold text-right'>{user?.name}</h4>
                                            <p className='text-sm text-gray-400 text-right' >{moment(item?.created_at).format("LL")}</p>
                                        </div>
                                    </div>
                                } else if (item?.from_company) {
                                    return <div className='self-start flex flex-col'>
                                        <div className='flex gap-2 items-end'>
                                            <Avatar src={`${UNIVERSAL.BASEURL}/company/${currentChat?.company_logo}`} sx={{ width: "2rem", height: "2rem" }} />
                                            <div className='rounded-t-lg rounded-br-lg bg-gray-200 text-black  w-80 p-3' >
                                                <p>{item.message}</p>

                                            </div>

                                        </div>
                                        <div className='self-start'>
                                            <h4 className='font-semibold text-left'>{currentChat?.company_name}</h4>
                                            <p className='text-sm text-gray-400 text-right' >{moment().format("LL")}</p>
                                        </div>
                                    </div>
                                }
                            } else {
                                if (item?.to_user) {
                                    return <div className='self-end flex flex-col'>
                                        <div className='flex gap-2 items-end'>
                                            <div className='rounded-t-lg rounded-bl-lg bg-blue-600 text-white  w-80 p-3' >
                                                <p>{item.message}</p>

                                            </div>
                                            <Avatar src={`${UNIVERSAL.BASEURL}/company/${user?.avatar}`} sx={{ width: "2rem", height: "2rem" }} />
                                        </div>

                                        <div className='self-end'>
                                            <h4 className='font-semibold text-right'>{user?.name}</h4>
                                            <p className='text-sm text-gray-400 text-right' >{moment(item?.created_at).format("LL")}</p>
                                        </div>
                                    </div>
                                } else if (item?.from_user) {
                                    return <div className='self-start flex flex-col'>
                                        <div className='flex gap-2 items-end'>
                                            <Avatar src={`${UNIVERSAL.BASEURL}/profilePic/${currentChat?.avatar}`} sx={{ width: "2rem", height: "2rem" }} />
                                            <div className='rounded-t-lg rounded-br-lg bg-gray-200 text-black  w-80 p-3' >
                                                <p>{item.message}</p>

                                            </div>

                                        </div>
                                        <div className='self-start'>
                                            <h4 className='font-semibold text-left'>{currentChat?.user_name}</h4>
                                            <p className='text-sm text-gray-400 text-right' >{moment(item.created_at).format("LL")}</p>
                                        </div>
                                    </div>
                                }
                            }
                        })}

                        {/*  */}
                        {/*  */}

                        {/*  */}
                    </div>
                    <div className='h-44 border-t p-5 w-full' >
                        <form onSubmit={handle_send_message} >
                            <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} className="focus:bg-white w-full focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" placeholder='Send a message to Uniblox' />
                            <button type="submit" className="bg-blue-500 text-white rounded-md py-2 mt-1 hover:shadow-md transition duration-200 hover:bg-blue-600 w-52 ">Send</button>
                        </form>
                    </div>
                </div>
            </Drawer>
        </DashboardLayout >
    )
}

export default Messages