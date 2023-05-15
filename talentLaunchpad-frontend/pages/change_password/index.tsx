import React, { useState } from "react"
import DashboardLayout from "@/components/dashboardLayout/DashboardLayout"
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector"
import { changePassword } from "@/slices/user/userSlice";
import { Alert, AlertColor, Snackbar } from "@mui/material";
import { useForm } from "react-hook-form";


const index = () => {
    const auth = useAppSelector(state => state.authentication.data);
    const [changePasswordMessage, setChangePasswordMessage] = useState<{ message: string, severity: string }>({ message: "", severity: "" })

    const dispatch = useAppDispatch();

    const { register, handleSubmit, watch, formState: { errors }, reset, getValues } = useForm<ChangePasswordFormData>();

    const handle_change_password = (data: ChangePasswordFormData) => {
        dispatch(changePassword({
            currentPassword: data.currentPassword,
            newPassword: data.newPasword,
            token: auth.token
        })).unwrap()
            .then(() => setChangePasswordMessage({ message: "Your password has been changed", severity: "success" }))
            .catch(() => setChangePasswordMessage({ message: "Incorrect current password!!", severity: "error" }))
    }


    return (
        <DashboardLayout>
            <div className="w-full">
                <h1 className='font-medium text-3xl '>Change Password</h1>
                <form onSubmit={handleSubmit(handle_change_password)} >
                    <div className="bg-white rounded-lg mt-8 shadow-[0_6px_15px_rgba(64,79,104,.05)] p-5">
                        {changePasswordMessage.message &&
                            <div className="flex flex-col w-1/2 mb-2">
                                <Alert variant="filled" severity={changePasswordMessage.severity as AlertColor}  >{changePasswordMessage.message}</Alert>
                            </div>}
                        <div className="flex flex-col w-1/2">
                            <label className="mb-1 font-medium" htmlFor="currentPassword">Current password</label>
                            <input className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" {...register("currentPassword", { required: { value: true, message: "*Please provide the current password" } })} id="currentPassword" placeholder="Current Password" type="password" />
                            {errors.currentPassword &&
                                <p className="text-red-500 mt-3" >{errors.currentPassword.message}</p>
                            }
                        </div>
                        <div className="flex flex-col w-1/2 mt-5">
                            <label className="mb-1 font-medium" htmlFor="newPassword">New password</label>
                            <input className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" {...register("newPasword", { required: { value: true, message: "*Please provide a new password" } })} id="newPassword" placeholder="New Password" type="password" />
                            {errors.newPasword &&
                                <p className="text-red-500 mt-3" >{errors.newPasword.message}</p>
                            }
                        </div>
                        <div className="flex flex-col w-1/2 mt-5">
                            <label className="mb-1 font-medium" htmlFor="confirmPassword">Confirm password</label>
                            <input className="focus:bg-white focus:border border-blue-600 transition duration-200  outline-none bg-gray-100 py-3 px-2  rounded-md" id="confirmPassword"
                                {...register("confirmPassword", { required: true, validate: () => getValues("confirmPassword") === getValues("newPasword") })}
                                placeholder="Confirm Password"
                                type="password"
                            />
                            {errors.confirmPassword && errors.confirmPassword.type === "validate" &&
                                <p className="text-red-600 mt-3" >*Confirm password doesn't match the New password</p>
                            }
                        </div>
                        <button type="submit" className="bg-blue-500 text-white rounded-md py-3 mt-5 hover:shadow-md transition duration-200 hover:bg-blue-600 w-60" >Update</button>
                    </div>
                </form>
            </div>
        </DashboardLayout>

    )
}

export default index

type ChangePasswordFormData = {
    currentPassword: string,
    newPasword: string,
    confirmPassword: string
}