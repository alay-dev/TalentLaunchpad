import { useState } from "react"
import DashboardLayout from "@/components/dashboardLayout/DashboardLayout"
import { HiOutlineBriefcase, HiOutlineDocumentText } from "react-icons/hi"
import { BiBriefcase, BiMessageSquareDetail } from "react-icons/bi"
import { BsBookmarkStar } from "react-icons/bs"
import ProfileViewChart from "@/components/profileViewChart/ProfileViewChart"
import { useAppSelector } from "@/hooks/useAppSelector"

const Dashboard = () => {
    const user = useAppSelector(state => state.authentication.data.user)
    return (
        <DashboardLayout>
            <div className="w-full" >
                <h1 className='font-medium text-3xl '>Howdy, {user?.name} !!</h1>
                <p className='mt-3 text-gray-500' >Ready to jump back in?</p>
                <div className="mt-8 gap-5 flex w-full justify-between">
                    <div className="bg-white rounded-lg shadow-[0_6px_15px_rgba(64,79,104,.05)] flex flex-1 justify-center items-start gap-6 p-5">
                        <div className="p-3 rounded-md bg-gray-100 " >
                            <HiOutlineBriefcase className="text-blue-500 text-4xl" />
                        </div>

                        <div className="flex flex-col" >
                            <h2 className="text-right text-3xl text-blue-500 font-medium" >22</h2>
                            <p>Applied jobs</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-[0_6px_15px_rgba(64,79,104,.05)] flex flex-1 justify-center items-start gap-6 p-5">
                        <div className="p-3 rounded-md bg-gray-100 " >
                            <HiOutlineDocumentText className="text-red-400 text-4xl" />
                        </div>

                        <div className="flex flex-col" >
                            <h2 className="text-right text-3xl text-red-400 font-medium" >9832</h2>
                            <p>Job alerts</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-[0_6px_15px_rgba(64,79,104,.05)] flex flex-1 justify-center items-start gap-6 p-5">
                        <div className="p-3 rounded-md bg-gray-100 " >
                            <BiMessageSquareDetail className="text-orange-300 text-4xl" />
                        </div>

                        <div className="flex flex-col" >
                            <h2 className="text-right text-3xl text-orange-300 font-medium" >74</h2>
                            <p>Messages</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-[0_6px_15px_rgba(64,79,104,.05)] flex flex-1 justify-center items-start gap-6 p-5">
                        <div className="p-3 rounded-md bg-gray-100 " >
                            <BsBookmarkStar className="text-green-500 text-4xl" />
                        </div>

                        <div className="flex flex-col" >
                            <h2 className="text-right text-3xl text-green-500 font-medium" >22</h2>
                            <p>Shortlist</p>
                        </div>
                    </div>
                </div>
                <div className=" mt-4 flex w-full gap-5">
                    <ProfileViewChart />
                    <div className="bg-white rounded-lg shadow-[0_6px_15px_rgba(64,79,104,.05)] flex-1 justify-center items-start  p-5">
                        <h3 className="font-medium text-lg mb-4" >Notifications</h3>
                        <ul className="flex flex-col gap-3" >
                            <li className="flex gap-2 items-start">
                                <div className="rounded-full p-2 bg-gray-100" >
                                    <BiBriefcase className="text-xl text-blue-500" />
                                </div>

                                <div className="flex ">
                                    <p><strong>Henry Wilson</strong> applied for the job <span className="text-blue-400" >Product designer</span></p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}

export default Dashboard