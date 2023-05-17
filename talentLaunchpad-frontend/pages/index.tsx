import Image from 'next/image'
import { Button } from "@mui/material"
import { HiOutlineUserPlus, HiOutlineDocumentDuplicate, HiOutlineDocumentCheck } from "react-icons/hi2"
import Header from '@/components/header/Header';
import { useRouter } from 'next/router';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { setSearchLocation, setSearchTerm } from '@/slices/job/jobSlice';

export default function Home() {

  const router = useRouter()
  const job = useAppSelector(state => state.job)

  const dispatch = useAppDispatch();


  return (
    <>
      <Header />
      <div className="">
        {/* hero starts */}
        <div className="relative flex items-end justify-end w-full h-screen bg-[url('/assets/heroBg.png')] bg-center bg-cover">
          <div className='absolute left-24 bottom-28'>
            <h1 className='text-gray-950 text-5xl font-bold  leading-none mb-6' >
              Join us & Explore <br /> Thousands of Jobs
            </h1>
            <p>Find jobs, Employment & Career Opportunities</p>
            <div className='bg-white py-6 px-10 rounded-lg shadow-sm flex items-center mt-10 gap-4' >
              <div className='w-56'>
                <h3 className='font-medium'>What</h3>
                <input className='py-1 w-full outline-none' value={job.searchTerm} onChange={(e) => dispatch(setSearchTerm(e.target.value))} placeholder='job title, keywords or company' />
              </div>
              <div className='w-0.5 h-14 bg-gray-300' />
              <div className='w-56'>
                <h3 className='font-medium'>Where</h3>
                <input className='py-1 w-full outline-none' value={job.searchLocation} onChange={(e) => dispatch(setSearchLocation(e.target.value))} placeholder='City or postcode' />
              </div>
              <Button className='h-16 bg-violet-600' onClick={() => router.push("/search_jobs")} variant="contained" >Find jobs</Button>
            </div>
          </div>
          <Image draggable={false} alt="Hero image" width={800} height={300} src="/assets/heroRight.png" />
        </div>
        {/* Hero ends */}
        {/* how it works starts */}
        <div className='flex flex-col items-center justify-center py-28'>
          <h1 className='text-4xl font-medium mb-6'>How it works?</h1>
          <p className='w-1/2 text-center font-light'>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna</p>
          <div className='flex gap-4 items-center mt-16'>
            <div className='hover:shadow-xl transition-all duration-200  rounded-lg flex flex-col justify-center items-center py-12 px-8'>
              <HiOutlineUserPlus size="3rem" color='#1967D2' />
              <h3 className='font-semibold text-lg mt-8  mb-3'>Register an account to start</h3>
              <p className='font-light text-center w-80'>Achieve virtually any design and layout from within the one template.</p>
            </div>
            <div className='hover:shadow-xl transition-all duration-200  rounded-lg flex flex-col justify-center items-center py-12 px-8'>
              <HiOutlineDocumentDuplicate size="3rem" color='#1967D2' />
              <h3 className='font-semibold text-lg mt-8  mb-3'>Explore over thousands of resumes</h3>
              <p className='font-light text-center w-80'>Achieve virtually any design and layout from within the one template.</p>
            </div>
            <div className='hover:shadow-xl transition-all duration-200  rounded-lg flex flex-col justify-center items-center py-12 px-8'>
              <HiOutlineDocumentCheck size="3rem" color='#1967D2' />
              <h3 className='font-semibold text-lg mt-8  mb-3'>Find the most suitable candidate</h3>
              <p className='font-light text-center w-80'>Achieve virtually any design and layout from within the one template.</p>
            </div>
          </div>
        </div>
        {/* how it works ends */}
        {/* Recruiting advantage start */}
        <div className="  w-full h-96  bg-[url('/assets/recruitBg.png')] bg-center bg-cover relative" >
          <div className='absolute top-0 left-0 backdrop-brightness-50  w-full h-full flex flex-col items-center justify-center ' >
            <h3 className='text-white font-semibold text-3xl mb-4'>Make Recruiting Your Competitive Advantage</h3>
            <p className='text-white  w-1/2 text-center mb-7' >Superio offers a way to completely optimize your entire recruiting process. Find better candidates, conduct more focused interviews, and make data-driven hiring decisions.</p>
            <Button size='large' className='bg-violet-600' variant="contained" onClick={() => router.push("/search_jobs")} >Get Started</Button>
          </div>
        </div>
        {/* Recruiting advantage ends */}
      </div>

    </>
  )
}
