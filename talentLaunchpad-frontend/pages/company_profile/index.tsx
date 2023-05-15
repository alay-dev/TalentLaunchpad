import { useState } from "react"
import DashboardLayout from '@/components/dashboardLayout/DashboardLayout'
import Image from 'next/image'
import { useForm } from 'react-hook-form';
import { HiPencil } from "react-icons/hi"
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { addCompanyDetail, changeCompanyLogo, getUserCompany, updateCompanyDetail } from '@/slices/company/companySlice';
import { useEffect } from 'react';
import { Modal } from "@mui/material";
import UNIVERSAL from "@/config/config";

const CompanyProfile = () => {
    const [changeLogoModal, setChangeLogoModal] = useState(false)
    const [logoTmp, setLogoTmp] = useState<any>(null)

    const user = useAppSelector(state => state.user)
    const auth = useAppSelector(state => state.authentication.data)
    const company = useAppSelector(state => state.company.userCompany)
    const dispatch = useAppDispatch();

    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<AddCompanyFormData>();

    const handle_add_company = (data: AddCompanyFormData) => {
        if (company.data.id) {
            dispatch(updateCompanyDetail({
                ...data,
                token: auth.token
            })).unwrap()
                .then(() => dispatch(getUserCompany({
                    token: auth.token
                })))
        } else {
            dispatch(addCompanyDetail({
                ...data,
                token: auth.token
            })).unwrap()
                .then(() => dispatch(getUserCompany({
                    token: auth.token
                })))
        }
    }

    useEffect(() => {
        if (auth.token) dispatch(getUserCompany({ token: auth.token }))
    }, [auth.token])

    useEffect(() => {
        if (company.data.id) {
            reset({
                companyName: company.data.company_name,
                phone: company.data.phone,
                email: company.data.email,
                website: company.data.website,
                companySize: company.data.company_size,
                aboutCompany: company.data.description,
                estSince: company.data.est_since,
                facebookLink: company.data.facebook_link,
                googlePlusLink: company.data.google_plus_link,
                linkedinLink: company.data.linkedin_link,
                twitterLink: company.data.twitter_link,
                country: company.data.location.split(",")[1],
                city: company.data.location.split(",")[0],
                completeAddress: company.data.complete_address,
                primaryIndustry: company.data.primary_industry
            })
        }
    }, [company.data.id])

    const handle_logo_change = (files: FileList | null) => {
        if (files?.length) {
            setLogoTmp(files[0])
            setChangeLogoModal(true)
        }
    }

    const handle_upload_logo = () => {
        dispatch(changeCompanyLogo({ token: auth.token, logo: logoTmp }))
            .unwrap()
            .then(() => { dispatch(getUserCompany({ token: auth.token })); setChangeLogoModal(false) })
    }

    return (
        <DashboardLayout>
            <div className="w-full">
                <h1 className='font-medium text-3xl '>Company Profile</h1>
                <div className="bg-white rounded-lg mt-8 shadow-[0_6px_15px_rgba(64,79,104,.05)]   p-5">
                    <form onSubmit={handleSubmit(handle_add_company)} >
                        <div className=" relative w-36 h-36 rounded-full flex justify-center items-center mb-6"  >
                            <Image alt="avatar" className="object-cover rounded-full " fill src={company?.data.company_logo ? `${UNIVERSAL.BASEURL}/company/${company?.data?.company_logo}` : "/assets/avatar.png"} />
                            <div>
                                <label className="cursor-pointer shadow-sm hover:shadow-md  rounded-full p-2 bg-blue-500 text-white  absolute bottom-0 right-0" htmlFor="avatar"><HiPencil className="text-lg" /></label>
                                <input className="hidden" id="avatar" type="file" onChange={(e) => handle_logo_change(e.target.files)} />

                            </div>
                        </div>
                        <div className="flex gap-5 mb-5">
                            <div className="flex flex-col w-1/2">
                                <label className="mb-1 font-medium" htmlFor="companyName">Company Name</label>
                                <input className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" {...register("companyName")} id="companyName" placeholder="Company name" type="text" />
                            </div>
                            <div className="flex flex-col w-1/2">
                                <label className="mb-1 font-medium" htmlFor="email">Email</label>
                                <input className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" {...register("email")} id="email" placeholder="Email" type="email" />
                            </div>
                        </div>
                        <div className="flex gap-5 mb-5">
                            <div className="flex flex-col w-1/2">
                                <label className="mb-1 font-medium" htmlFor="phone">Phone</label>
                                <input className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" {...register("phone")} id="phone" placeholder="Phone" type="tel" />
                            </div>
                            <div className="flex flex-col w-1/2">
                                <label className="mb-1 font-medium" htmlFor="website">Website</label>
                                <input className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" {...register("website")} id="website" placeholder="Website" type="text" />
                            </div>
                        </div>
                        <div className="flex gap-5 mb-5">
                            <div className="flex flex-col w-1/2">
                                <label className="mb-1 font-medium" htmlFor="estSince">Est. since</label>
                                <input className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" {...register("estSince")} id="estSince" placeholder="Est. Since" type="text" />
                            </div>
                            <div className="flex flex-col w-1/2">
                                <label className="mb-1 font-medium" htmlFor="companySize">Company size</label>
                                <select className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" {...register("companySize")} id="companySize" >
                                    <option value="0 - 10" >0 - 10</option>
                                    <option value="10 - 50" >10 - 50</option>
                                    <option value="50 - 100" >50 - 100</option>
                                    <option value="More than 100" >More than 100</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-5 mb-5">
                            <div className="flex flex-col w-1/2">
                                <label className="mb-1 font-medium" htmlFor="primary_industry">Primary industry</label>
                                <input className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" {...register("primaryIndustry")} id="primaryIndustry" placeholder="Primary Industry" type="text" />
                            </div>

                        </div>
                        <div className="flex flex-col w-full">
                            <label className="mb-1 font-medium" htmlFor="aboutCompany">About company</label>
                            <textarea className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" {...register("aboutCompany")} id="aboutCompany" placeholder="About company" rows={10} />
                        </div>
                        <h3 className='font-medium text-lg mt-8' >Social network</h3>
                        <div className="flex gap-5 mb-5 mt-4">
                            <div className="flex flex-col w-1/2">
                                <label className="mb-1 font-medium" htmlFor="Linkedin">Linkedin</label>
                                <input className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" {...register("linkedinLink")} id="Linkedin" placeholder="Linkedin" type="text" />
                            </div>
                            <div className="flex flex-col w-1/2">
                                <label className="mb-1 font-medium" htmlFor="GooglePlus">Google Plus</label>
                                <input className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" {...register("googlePlusLink")} id="GooglePlus" placeholder="Github" />
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
                        <h3 className='font-medium text-lg mt-8' >Contact information</h3>
                        <div className="flex gap-5 mb-5 mt-4">
                            <div className="flex flex-col w-1/2">
                                <label className="mb-1 font-medium" htmlFor="country">Country</label>
                                <input className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" {...register("country")} id="country" placeholder="Country" type="text" />
                            </div>
                            <div className="flex flex-col w-1/2">
                                <label className="mb-1 font-medium" htmlFor="city">City</label>
                                <input className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" {...register("city")} id="city" placeholder="City" />
                            </div>
                        </div>
                        <div className="flex gap-5 mb-5 mt-4">
                            <div className="flex flex-col w-full">
                                <label className="mb-1 font-medium" htmlFor="completeAddress">Complete address</label>
                                <input className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" {...register("completeAddress")} id="completeAddress" placeholder="Complete address" type="text" />
                            </div>
                        </div>
                        <button type="submit" className="bg-blue-500 text-white rounded-md py-3 mt-5 hover:shadow-md transition duration-200 hover:bg-blue-600 w-60" >{company.data.id ? "Update" : "Save"}</button>
                    </form>
                </div>
            </div>
            <Modal open={changeLogoModal} onClose={() => setChangeLogoModal(false)}>
                <div className=" w-4/12 flex flex-col items-center bg-white p-8 rounded-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 outline-none " >
                    <h3 className="self-start font-semibold text-lg mb-4"  >Change company logo</h3>
                    {logoTmp &&
                        <Image alt="company logo" className="rounded-lg overflow-hidden" width={200} height={200} src={URL.createObjectURL(logoTmp)} />
                    }
                    <div className='flex self-end mt-4 gap-4 justify-end items-center' >
                        <button onClick={() => setChangeLogoModal(false)} className="bg-white border border-blue-500 text-blue-500 rounded-md py-2 mt-5  transition duration-200  w-40" >Cancel</button>
                        <button onClick={() => handle_upload_logo()} className="bg-blue-500 text-white rounded-md py-2 mt-5 hover:shadow-md transition duration-200 hover:bg-blue-600 w-40" >Save</button>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    )
}

export default CompanyProfile

type AddCompanyFormData = {
    companyName: string,
    email: string,
    phone: string,
    website: string,
    estSince: string,
    companySize: string,
    aboutCompany: string,
    linkedinLink: string,
    googlePlusLink: string,
    twitterLink: string,
    facebookLink: string,
    country: string,
    city: string,
    completeAddress: string,
    primaryIndustry: string
}