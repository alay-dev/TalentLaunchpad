import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import UNIVERSAL from '../../config/config';

type InitialState = {
    data: any,
    education: {
        error: string
        loading: boolean
    },
    work: {
        error: string
        loading: boolean
    },
    project: {
        error: string
        loading: boolean
    },
    error: string
    loading: boolean
}

const initialState: InitialState = {
    data: "",
    education: {
        error: "",
        loading: false
    },
    work: {
        error: "",
        loading: false
    },
    project: {
        error: "",
        loading: false
    },
    error: "",
    loading: false
}

type AddEducationPayload = {
    school: string,
    degree: string,
    startDate: Date,
    endDate: Date,
    description: string,
    token: string
}

type AddWorkExperiencePayload = {
    company: string,
    jobTitle: string,
    startDate: Date,
    endDate: Date,
    description: string,
    token: string
}

type AddProjectPayload = {
    projectName: string,
    startDate: Date,
    endDate: Date,
    description: string,
    token: string
}

type UpdateResumePayload = {
    description: string,
    skills: string,
    token: string
}

type GetResumePayload = {
    user_id: number,
}

type DeleteEducationPayload = {
    education_id: number,
    token: string,
}


type DeleteWorkExperiencePayload = {
    work_experience_id: number,
    token: string,
}

type ChangeResumePayload = {
    resume: File,
    token: string
}

export const getResume = createAsyncThunk(
    '/resume/getResume',
    (data: GetResumePayload, { rejectWithValue }) => {
        console.log(data)
        return fetch(`${UNIVERSAL.BASEURL}/api/resume/${data.user_id}`, {
            headers: {
                "Content-Type": "application/json",
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

export const addEducation = createAsyncThunk(
    '/resume/addEducation',
    (data: AddEducationPayload, { rejectWithValue }) => {
        return fetch(`${UNIVERSAL.BASEURL}/api/resume/add_education`, {
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

export const addWorkExperience = createAsyncThunk(
    '/resume/addWorkExperience',
    (data: AddWorkExperiencePayload, { rejectWithValue }) => {
        return fetch(`${UNIVERSAL.BASEURL}/api/resume/add_work_experience`, {
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

export const addProject = createAsyncThunk(
    '/resume/addProject',
    (data: AddProjectPayload, { rejectWithValue }) => {
        return fetch(`${UNIVERSAL.BASEURL}/api/resume/add_project`, {
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

export const deleteEducation = createAsyncThunk(
    '/resume/deleteEducation',
    (data: DeleteEducationPayload, { rejectWithValue }) => {
        console.log(data)
        return fetch(`${UNIVERSAL.BASEURL}/api/resume/remove_education/${data.education_id}`, {
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

export const deleteWorkExperience = createAsyncThunk(
    '/resume/deleteWorkExperience',
    (data: DeleteWorkExperiencePayload, { rejectWithValue }) => {
        console.log(data)
        return fetch(`${UNIVERSAL.BASEURL}/api/resume/remove_work_experience/${data.work_experience_id}`, {
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

export const updateResume = createAsyncThunk(
    '/resume/updateResume',
    (data: UpdateResumePayload, { rejectWithValue }) => {
        return fetch(`${UNIVERSAL.BASEURL}/api/resume/update_resume`, {
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

export const changeResume = createAsyncThunk(
    '/user/changeProfilePic',
    (data: ChangeResumePayload, { rejectWithValue }) => {
        const formData = new FormData();
        formData.append("resume", data.resume)

        return fetch(`${UNIVERSAL.BASEURL}/api/resume/change_resume`, {
            method: 'PATCH',
            headers: {
                "Authorization": `Bearer ${data.token}`
            },
            body: formData
        }).then((response) => response.json())
            .then((res) => {
                if (res.status !== "success") return rejectWithValue(res);
                return res.data;
            });
    }
);

const resumeSlice = createSlice({
    name: 'resume',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(addEducation.pending, (state) => {
            state.education.loading = true;
        });
        builder.addCase(addEducation.rejected, (state, action) => {
            state.education.loading = false;
            state.education.error = action.error.message!;
        });
        builder.addCase(addWorkExperience.pending, (state) => {
            state.work.loading = true;
        });
        builder.addCase(addWorkExperience.rejected, (state, action) => {
            state.work.loading = false;
            state.work.error = action.error.message!;
        });
        builder.addCase(addProject.pending, (state) => {
            state.project.loading = true;
        });
        builder.addCase(addProject.rejected, (state, action) => {
            state.project.loading = false;
            state.project.error = action.error.message!;
        });
        builder.addCase(getResume.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getResume.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
            state.error = ""
        });
        builder.addCase(getResume.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message!;
        });
        builder.addCase(updateResume.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message!;
        });
    },
});

export default resumeSlice.reducer;