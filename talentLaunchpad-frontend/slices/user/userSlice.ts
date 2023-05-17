import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import UNIVERSAL from '../../config/config';
import { User } from '@/entity/user';

type InitialState = {
  data: User;
  loading: boolean;
  error: any;
};

const initialState: InitialState = {
  data: {
    id: -1,
    created_at: new Date(),
    updated_at: new Date(),
    bio: "",
    avatar: "",
    gender: "",
    email: "",
    phone: "",
    company_id: -1,
    resume: "",
    status: "active",
    user_type: "candidate",
    name: "asd",
    website: "",
    current_salary: "",
    expected_salary: "",
    age: -1,
    experience: "",
    linkedin_link: "",
    github_link: "",
    twitter_link: "",
    facebook_link: "",
  },
  loading: true,
  error: '',
};

type changePasswordPayload = {
  newPassword: string,
  currentPassword: string,
  token: string
}

type changeProfilePicPayload = {
  token: string,
  avatar: File
}

export const changeProfilePic = createAsyncThunk(
  '/user/changeProfilePic',
  (data: changeProfilePicPayload, { rejectWithValue }) => {
    const formData = new FormData();
    formData.append("avatar", data.avatar)

    return fetch(`${UNIVERSAL.BASEURL}/api/users/change_profile_pic`, {
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

export const changePassword = createAsyncThunk(
  '/user/changePassword',
  (data: changePasswordPayload, { rejectWithValue }) => {
    return fetch(`${UNIVERSAL.BASEURL}/api/users/update_password`, {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${data.token}`,
      },
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

export const getForgetPasswordCode = createAsyncThunk(
  '/user/fetchForgotPasswordCode',
  (email: string, { rejectWithValue }) => {
    return fetch(`${UNIVERSAL.BASEURL}/api/v1/auth/forgot_password`, {
      method: 'POST',
      body: JSON.stringify({
        email: email
      })

    })
      .then((response) => response.json())
      .then((res) => {
        if (!res.success) return rejectWithValue(res);
        return res.data;
      });
  }
);

export const validateResetCode = createAsyncThunk(
  '/user/validateResetCode',
  (code: string, { rejectWithValue }) => {
    return fetch(`${UNIVERSAL.BASEURL}/api/v1/auth/validate_reset_code`, {
      method: 'POST',
      body: JSON.stringify({
        code: code
      })

    })
      .then((response) => response.json())
      .then((res) => {
        if (!res.success) return rejectWithValue(res);
        return res.data;
      });
  }
);

type ResetPasswordProps = {
  code: string,
  password: string
}

export const resetPassword = createAsyncThunk(
  '/user/resetPassword',
  (data: ResetPasswordProps, { rejectWithValue }) => {
    return fetch(`${UNIVERSAL.BASEURL}/api/v1/auth/reset_password`, {
      method: 'POST',
      body: JSON.stringify({
        code: data.code,
        password: data.password
      })

    })
      .then((response) => response.json())
      .then((res) => {
        if (!res.success) return rejectWithValue(res);
        return res.data;
      });
  }
);


type fetchUserProfileData = {
  token: string,
  // euid: string
}

export const fetchUserProfile = createAsyncThunk(
  '/user/fetchUserProfile',
  (data: fetchUserProfileData) => {
    return fetch(`${UNIVERSAL.BASEURL}/api/users/profile`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${data.token}`
      },
      method: 'GET',
    })
      .then((response) => response.json())
      .then((res) => {
        // localStorage.setItem('ENTERPRISE_DASHBOARD_EMAIL', data.email);
        return res.data;
      });
  }
);

type updateUserProfileData = {
  bio: string,
  phone: string,
  resume: string,
  gender: string,
  name: string,
  website: string,
  currentSalary: string,
  expectedSalary: string,
  age: number,
  experience: string,
  linkedinLink: string,
  githubLink: string,
  twitterLink: string,
  facebookLink: string,
  token: string
}

export const updateUserProfile = createAsyncThunk(
  '/user/updateUserProfile',
  (data: updateUserProfileData) => {
    return fetch(`${UNIVERSAL.BASEURL}/api/users/update_profile`, {
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
        // localStorage.setItem('ENTERPRISE_DASHBOARD_EMAIL', data.email);
        return res.data;
      });
  }
);


const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.data = action.payload;
    },
    clearProfile: (state) => {
      state.data = {
        id: -1,
        created_at: new Date(),
        updated_at: new Date(),
        bio: "",
        gender: "",
        avatar: "",
        email: "",
        phone: "",
        company_id: -1,
        status: "active",
        user_type: "candidate",
        name: "asd",
        website: "",
        resume: "",
        current_salary: "",
        expected_salary: "",
        age: -1,
        experience: "",
        linkedin_link: "",
        github_link: "",
        twitter_link: "",
        facebook_link: "",
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserProfile.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = '';
    });
    builder.addCase(fetchUserProfile.rejected, (state, action) => {
      state.loading = false;
      state.data = {} as User;
      state.error = action.error.message;
    });

  },
});

export default userSlice.reducer;
export const { setProfile, clearProfile } = userSlice.actions;
