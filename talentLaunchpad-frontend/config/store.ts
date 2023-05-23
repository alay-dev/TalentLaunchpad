import { configureStore } from '@reduxjs/toolkit';
import userReducer from "@/slices/user/userSlice"
import authenticationReducer from "@/slices/authentication/authenticationSlice"
import resumeReducer from "@/slices/resume/resumeSlice"
import companyReducer from "@/slices/company/companySlice"
import jobReducer from "@/slices/job/jobSlice"
import messageReducer from "@/slices/message/messageSlice"


const store = configureStore({
    reducer: {
        authentication: authenticationReducer,
        user: userReducer,
        resume: resumeReducer,
        company: companyReducer,
        job: jobReducer,
        message: messageReducer
    },
});

export default store;

export type Rootstate = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;