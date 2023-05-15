import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import UNIVERSAL from '../../config/config';
import { Company } from '@/entity/company';

type InitialState = {
    data: any,
    userCompany: {
        data: Company,
        error: string,
        loading: boolean
    },
    error: string
    loading: boolean
}

const initialState: InitialState = {
    data: "",
    userCompany: {
        data: {
            id: -1,
            created_at: new Date(),
            updated_at: new Date(),
            user_id: -1,
            location: "",
            description: "",
            company_name: "",
            company_logo: "",
            company_size: "",
            phone: "",
            email: "",
            facebook_link: "",
            twitter_link: "",
            google_plus_link: "",
            linkedin_link: "",
            website: "",
            complete_address: "",
            est_since: "",
            primary_industry: ""
        },
        error: "",
        loading: false
    },
    error: "",
    loading: false
}



type AddCompanyPayload = {
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
    primaryIndustry: string,
    token: string,
}

type GetUserCompnayPayload = {
    token: string,
}

type ChangeLogoPayload = {
    logo: File,
    token: string,
}

export const changeCompanyLogo = createAsyncThunk(
    '/user/changeCompanyLogo',
    (data: ChangeLogoPayload, { rejectWithValue }) => {
        const formData = new FormData();
        formData.append("companyLogo", data.logo)

        return fetch(`${UNIVERSAL.BASEURL}/api/company/change_company_logo`, {
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


export const updateCompanyDetail = createAsyncThunk(
    '/company/updateCompanyDetail',
    (data: AddCompanyPayload, { rejectWithValue }) => {
        return fetch(`${UNIVERSAL.BASEURL}/api/company/update_company`, {
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

export const addCompanyDetail = createAsyncThunk(
    '/company/addCompanyDetail',
    (data: AddCompanyPayload, { rejectWithValue }) => {
        return fetch(`${UNIVERSAL.BASEURL}/api/company/create_company`, {
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

export const getUserCompany = createAsyncThunk(
    '/company/getUserCompany',
    (data: GetUserCompnayPayload, { rejectWithValue }) => {
        return fetch(`${UNIVERSAL.BASEURL}/api/company/user_company`, {
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


const companySlice = createSlice({
    name: 'company',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(addCompanyDetail.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(addCompanyDetail.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
        });
        builder.addCase(addCompanyDetail.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message!;
        });
        builder.addCase(getUserCompany.pending, (state) => {
            state.userCompany.loading = true;
        });
        builder.addCase(getUserCompany.fulfilled, (state, action) => {
            state.userCompany.loading = false;
            state.userCompany.data = action.payload;
        });
        builder.addCase(getUserCompany.rejected, (state, action) => {
            state.userCompany.loading = false;
            state.userCompany.error = action.error.message!;
        });
    },
});

export default companySlice.reducer;