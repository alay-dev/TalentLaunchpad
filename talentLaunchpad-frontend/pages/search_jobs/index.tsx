import React, { useState, useEffect } from 'react'
import { TextField, Switch } from '@mui/material'
import JobCard from '@/components/jobCard/JobCard'
import Header from '@/components/header/Header'
import { GetStaticProps } from 'next'
import UNIVERSAL from '@/config/config'
import { Job } from '@/entity/jobs'
import Link from 'next/link'
import { useAppSelector } from '@/hooks/useAppSelector'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { getJobsByFilter } from '@/slices/job/jobSlice'

// type Props = {
//     jobs: Job[]
// }

const SearchJobs = () => {
    // console.log(jobs);
    const [searchTerm, setSearchTerm] = useState("");
    const [location, setLocation] = useState("");
    const [isFullTime, setIsFullTime] = useState(true);
    const [isFreelance, setIsFreelance] = useState(true);
    const [isInternship, setIsInternship] = useState(true);

    const jobs = useAppSelector(state => state.job.data)

    const dispatch = useAppDispatch();

    const get_job_type = () => {
        let arr: string[] = []
        if (isFullTime) {
            arr.push("Full Time")
        }
        if (isFreelance) {
            arr.push("Freelance")
        }
        if (isInternship) {
            arr.push("Internship")
        }

        return arr;
    }


    useEffect(() => {
        dispatch(getJobsByFilter({
            jobType: get_job_type(),
            location: location,
            searchTerm: searchTerm
        }))
    }, [isFreelance, isFullTime, isInternship, searchTerm])

    return (
        <>
            <Header />
            <div className='mt-20 px-10 py-5 flex gap-10 items-start' >
                <div className='w-96  bg-cyan-50 p-5 rounded-md shadow-sm max-h-max '>
                    <h2 className='text-xl  font-medium mb-2'>Search by keywords</h2>
                    <TextField className='bg-white ' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} fullWidth placeholder='job title, keywords or company' />

                    <h2 className='mt-6 text-xl font-medium mb-2'>Location</h2>
                    <TextField className='bg-white ' fullWidth placeholder='City or pincode' />
                    <h2 className='mt-6 text-xl font-medium mb-2'>Job type</h2>

                    <div className='flex items-center gap-2 mb-1'>
                        <Switch checked={isFreelance} onChange={() => setIsFreelance(!isFreelance)} />
                        <p className='text-gray-500' >Freelance</p>
                    </div>
                    <div className='flex items-center gap-2 mb-1'>
                        <Switch checked={isFullTime} onChange={() => setIsFullTime(!isFullTime)} />
                        <p className='text-gray-500' >Full Time</p>
                    </div>
                    <div className='flex items-center gap-2 mb-1'>
                        <Switch checked={isInternship} onChange={() => setIsInternship(!isInternship)} />
                        <p className='text-gray-500' >Internship</p>
                    </div>

                </div>
                <div className='flex-1'>
                    <div className='flex flex-col gap-5'>
                        {jobs?.length === 0 && <p>No jobs to show!!</p>}
                        {jobs?.map?.(job => {
                            return <Link key={job.id} href={`/job/${job.id}`} >
                                <JobCard
                                    key={job.id}
                                    industry={job.industry}
                                    jobTitle={job.job_title}
                                    jobType={job.job_type}
                                    location={job.location}
                                    salary={job.salary}
                                    jobId={job.id}
                                    createdAt={job.created_at}
                                />
                            </Link>
                        })}
                    </div>

                </div>
            </div>
        </>
    )
}

export default SearchJobs;

// export const getStaticProps: GetStaticProps = async (context) => {
//     const res = await fetch(`${UNIVERSAL.BASEURL}/api/jobs`)
//     const job_data = await res.json()

//     return {
//         props: {
//             jobs: job_data.data,
//         }
//     }
// }