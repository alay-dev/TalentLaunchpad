import { MenuItem, TextField } from "@mui/material"


const ProfileViewChart = () => {
    return (
        <div className="bg-white rounded-lg shadow-[0_6px_15px_rgba(64,79,104,.05)] w-[35rem] justify-center items-start  p-5">
            <div className="flex justify-between items-center w-full">
                <h3 className="font-medium text-lg" >Your profile view</h3>
                <TextField className="w-40" select>
                    <MenuItem>Last 6 months</MenuItem>
                </TextField>
            </div>
        </div>
    )
}

export default ProfileViewChart