import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import UNIVERSAL from '../../config/config';
import { Job } from '@/entity/jobs';

type InitialState = {
    data: any,
    userJob: {
        data: [],
        error: string,
        loading: boolean
    },
    appliedJobs: {
        data: AppliedJob[],
        error: string,
        loading: boolean
    },
    error: string
    loading: boolean
}

const initialState: InitialState = {
    data: "",
    userJob: {
        data: [],
        error: "",
        loading: false
    },
    appliedJobs: {
        data: [],
        error: "",
        loading: false
    },
    error: "",
    loading: false
}


type AppliedJob = {
    job_title: string,
    applied_at: Date,
    status: string,
    message: string,
    resume: string,
    job_industry: string,
    location: string
}



type AddJobPayload = {
    companyId: number,
    jobTitle: string,
    description: string,
    jobType: string,
    qualificationRequired: string,
    experienceRequired: string,
    location: string,
    salary: string,
    skillsRequired: string,
    applyLink: string,
    token: string,
}

type UpdateJobPayload = {
    jobId: number,
    jobTitle: string,
    description: string,
    jobType: string,
    qualificationRequired: string,
    experienceRequired: string,
    location: string,
    salary: string,
    skillsRequired: string,
    applyLink: string,
    token: string,
}

type GetUserCompnayPayload = {
    token: string,
}

type DeleteJob = {
    id: string,
    token: string,
}

export const getAllJobs = createAsyncThunk(
    '/job/getAllJobs',
    () => {
        return fetch(`${UNIVERSAL.BASEURL}/api/jobs`, {
            headers: {
                "Content-Type": "application/json",
                // "Authorization": `Bearer ${data.token}`
            },
            method: 'GET',
        })
            .then((response) => response.json())
            .then((res) => {
                // if (res.status !== "success") return rejectWithValue(res);
                return res.data;
            });
    }
);

export const getAppliedJobs = createAsyncThunk(
    '/job/getAllJobs',
    (data: { token: string }, { rejectWithValue }) => {
        return fetch(`${UNIVERSAL.BASEURL}/api/jobs/applied_jobs`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${data.token}`
            },
            method: 'GET',
        })
            .then((response) => response.json())
            .then((res) => {
                if (res.status !== "success") return rejectWithValue(res);
                return res.data;
            });
    }
);


export const updateJobDetail = createAsyncThunk(
    '/job/updateJobDetail',
    (data: UpdateJobPayload, { rejectWithValue }) => {
        return fetch(`${UNIVERSAL.BASEURL}/api/jobs/update_job`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${data.token}`
            },
            method: 'PATCH',
            body: JSON.stringify({
                ...data
            })

        })
            .then((response) => response.json())
            .then((res) => {
                if (res.status !== "success") return rejectWithValue(res);
                return res.data;
            });
    }
);

export const addJobDetail = createAsyncThunk(
    '/job/addJobDetail',
    (data: AddJobPayload, { rejectWithValue }) => {
        return fetch(`${UNIVERSAL.BASEURL}/api/jobs/create_job`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${data.token}`
            },
            method: 'POST',
            body: JSON.stringify({
                ...data
            })

        })
            .then((response) => response.json())
            .then((res) => {
                if (res.status !== "success") return rejectWithValue(res);
                return res.data;
            });
    }
);

export const getUserJobs = createAsyncThunk(
    '/job/getUserJob',
    (data: GetUserCompnayPayload, { rejectWithValue }) => {
        return fetch(`${UNIVERSAL.BASEURL}/api/jobs/user_job`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${data.token}`
            },
            method: 'GET',
        })
            .then((response) => response.json())
            .then((res) => {
                if (res.status !== "success") return rejectWithValue(res);
                return res.data;
            });
    }
);

export const deleteJob = createAsyncThunk(
    '/job/deleteJob',
    (data: DeleteJob, { rejectWithValue }) => {
        return fetch(`${UNIVERSAL.BASEURL}/api/jobs/${data.id}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${data.token}`
            },
            method: 'DELETE',

        })
            .then((response) => response.json())
            .then((res) => {
                if (res.status !== "success") return rejectWithValue(res);
                return res.data;
            });
    }
);

type ApplyJobPayload = {
    message: string,
    resume: string,
    jobId: number,
    token: string
}

export const applyJob = createAsyncThunk(
    '/job/applyJob',
    (data: ApplyJobPayload, { rejectWithValue }) => {
        return fetch(`${UNIVERSAL.BASEURL}/api/jobs/apply_job`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${data.token}`
            },
            method: 'POST',
            body: JSON.stringify({
                ...data
            })

        })
            .then((response) => response.json())
            .then((res) => {
                if (res.status !== "success") return rejectWithValue(res);
                return res.data;
            });
    }
);


const jobSlice = createSlice({
    name: 'job',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(addJobDetail.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(addJobDetail.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
        });
        builder.addCase(addJobDetail.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message!;
        });
        builder.addCase(getUserJobs.pending, (state) => {
            state.userJob.loading = true;
        });
        builder.addCase(getUserJobs.fulfilled, (state, action) => {
            state.userJob.loading = false;
            state.userJob.data = action.payload;
            state.userJob.error = ""
        });
        builder.addCase(getUserJobs.rejected, (state, action) => {
            state.userJob.loading = false;
            state.userJob.error = action.error.message!;
        });
        builder.addCase(applyJob.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(applyJob.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
            state.error = ""
        });
        builder.addCase(applyJob.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message!;
        });
        builder.addCase(getAppliedJobs.pending, (state) => {
            state.appliedJobs.loading = true;
        });
        builder.addCase(getAppliedJobs.fulfilled, (state, action) => {
            state.appliedJobs.loading = false;
            state.appliedJobs.data = action.payload;
            state.appliedJobs.error = ""
        });
        builder.addCase(getAppliedJobs.rejected, (state, action) => {
            state.appliedJobs.loading = false;
            state.appliedJobs.error = action.error.message!;
        });
    },
});

export default jobSlice.reducer;