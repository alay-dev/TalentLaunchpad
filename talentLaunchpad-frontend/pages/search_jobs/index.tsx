import React from 'react'
import { TextField, Switch } from '@mui/material'
import JobCard from '@/components/jobCard/JobCard'
import Header from '@/components/header/Header'
import { GetStaticProps } from 'next'
import UNIVERSAL from '@/config/config'
import { Job } from '@/entity/jobs'
import Link from 'next/link'

type Props = {
    jobs: Job[]
}

const index = ({ jobs }: Props) => {
    console.log(jobs);

    return (
        <>
            <Header />
            <div className='mt-20 px-10 py-5 flex gap-10 items-start' >
                <div className='w-96  bg-cyan-50 p-5 rounded-md shadow-sm max-h-max '>
                    <h2 className='text-xl  font-medium mb-2'>Search by keywords</h2>
                    <TextField className='bg-white ' fullWidth placeholder='job title, keywords or company' />

                    <h2 className='mt-6 text-xl font-medium mb-2'>Location</h2>
                    <TextField className='bg-white ' fullWidth placeholder='City or pincode' />
                    <h2 className='mt-6 text-xl font-medium mb-2'>Job type</h2>
                    <div className='flex items-center gap-2 mb-1'>
                        <Switch />
                        <p className='text-gray-500' >Freelancer</p>
                    </div>
                    <div className='flex items-center gap-2 mb-1'>
                        <Switch />
                        <p className='text-gray-500' >Full Time</p>
                    </div>
                    <div className='flex items-center gap-2 mb-1'>
                        <Switch />
                        <p className='text-gray-500' >Part Time</p>
                    </div>
                    <div className='flex items-center gap-2 mb-1'>
                        <Switch />
                        <p className='text-gray-500' >Temporary</p>
                    </div>
                </div>
                <div className='flex-1'>
                    <div className='flex flex-col gap-5'>
                        {jobs.map?.(job => {
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

export default index;

export const getStaticProps: GetStaticProps = async (context) => {
    const res = await fetch(`${UNIVERSAL.BASEURL}/api/jobs`)
    const job_data = await res.json()

    return {
        props: {
            jobs: job_data.data,
        }
    }
}