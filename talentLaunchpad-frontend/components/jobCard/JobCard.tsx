import Image from 'next/image'
import { SlBriefcase } from "react-icons/sl"
import { CiLocationOn, CiTimer } from "react-icons/ci"
import { BsCashCoin, BsBookmarkPlus } from "react-icons/bs"
import { IconButton } from "@mui/material"
import moment from 'moment'
import UNIVERSAL from '@/config/config'

type Props = {
    jobId: number,
    jobTitle: string,
    industry: string,
    location: string,
    salary: string,
    jobType: string,
    companyLogo: string,
    remote: boolean,
    urgent: boolean,
    createdAt: Date
}

const JobCard = ({ jobId, industry, jobTitle, jobType, location, salary, urgent, remote, createdAt, companyLogo }: Props) => {
    return (
        <div className='flex items-start gap-5 border p-5 rounded-lg  hover:shadow-xl transition-all cursor-pointer relative' >
            <div className='absolute top-2 right-2'>
                <IconButton>
                    <BsBookmarkPlus size="1.2rem" />
                </IconButton>
            </div>
            <Image alt="company logo" width={50} height={50} src={`${UNIVERSAL.BASEURL}/company/${companyLogo}`} />
            <div>
                <h2 className='mb-5' >{jobTitle}</h2>
                <div className='flex gap-8 items-center mb-4'>
                    <div className='flex gap-2 items-center'>
                        <SlBriefcase />
                        <p className='font-light'>{industry}</p>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <CiLocationOn />
                        <p className='font-light' >{location}</p>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <CiTimer />
                        <p className='font-light' >{moment(createdAt).format("LL")}</p>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <BsCashCoin />
                        <p className='font-light' >{salary}</p>
                    </div>
                </div>
                <div className='flex gap-3 items-center '>
                    <div className='py-1 px-4 bg-blue-100 text-blue-600 rounded-2xl'>
                        <p className='text-sm' >{jobType}</p>
                    </div>
                    {urgent &&
                        <div className='py-1 px-4 bg-orange-100 text-orange-600 rounded-2xl'>
                            <p className='text-sm' >Urgent</p>
                        </div>
                    }
                    {remote &&
                        <div className='py-1 px-4 bg-green-100 text-green-600 rounded-2xl'>
                            <p className='text-sm' >Remote</p>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default JobCard