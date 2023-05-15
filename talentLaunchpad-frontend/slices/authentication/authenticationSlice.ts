import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import UNIVERSAL from '../../config/config';
import { User } from '@/entity/user';

const NoUser = {
  id: -1,
  created_at: new Date(),
  updated_at: new Date(),
  bio: "",
  avatar: "",
  email: "",
  phone: "",
  company_id: -1,
  status: "active" as "active",
  user_type: "candidate" as "candidate",
  resume: "",
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
}

type InitialState = {
  data: {
    token: string,
    user: User
  };
  loading: boolean;
  error: any;
};

type SignupWithEmailPayload = {
  name: string;
  email: string;
  password: string;
  userType: string;
};

type EmailLoginPayload = {
  email: string;
  password: string;
};

const initialState: InitialState = {
  data: {
    token: "",
    user: NoUser
  },
  loading: false,
  error: '',
};



export const loginWithGoogle = createAsyncThunk(
  '/authentication/loginWithGoogle',
  (token: string, { rejectWithValue }) => {
    return fetch(`${UNIVERSAL.BASEURL}/api/v1/auth/google/login`, {
      method: 'POST',
      body: JSON.stringify({
        googleJWT: token,
      }),
    })
      .then((response) => response.json())
      .then((res) => {
        if (res?.data?.is_user_exists === false) {
          return rejectWithValue(res);
        } else {
          sessionStorage.setItem(
            'ENTERPRISE_DASHBOARD_EMAIL',
            res.data.user.email
          );
          return res.data;
        }
      });
  }
);

export const signupWithGoogle = createAsyncThunk(
  '/authentication/signupWithGoogle',
  (token: string) => {
    return fetch(`${UNIVERSAL.BASEURL}/api/v1/auth/google/signup`, {
      headers: {
        "Content-Type": "application/json"
      },
      method: 'POST',
      body: JSON.stringify({
        googleJWT: token,
      }),
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success) {
          // loginWithGoogle(token);
        }
      });
  }
);

export const signupWithEmail = createAsyncThunk(
  '/authentication/signupWithEmail',
  (data: SignupWithEmailPayload, { rejectWithValue }) => {
    return fetch(`${UNIVERSAL.BASEURL}/api/users/signup`, {
      headers: {
        "Content-Type": "application/json"
      },
      method: 'POST',
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password,
        user_type: data.userType
      }),
    })
      .then((response) => response.json())
      .then((res) => {

        if (res.status !== "success") return rejectWithValue(res);
      });
  }
);

export const emailLogin = createAsyncThunk(
  '/authentication/emailLogin',
  (credential: EmailLoginPayload, { rejectWithValue }) => {
    return fetch(`${UNIVERSAL.BASEURL}/api/users/login`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: credential.email,
        password: credential.password,
      }),
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.status === "success") {
          sessionStorage.setItem(
            'TALENTLAUNCHPAD_TOKEN',
            res?.data?.token
          );

          return res.data;
        } else {
          console.log(res);
          return rejectWithValue(res);
        }
      })
      .catch((e) => {
        console.log(e);
        return e;
      });
  }
);

const authenticationSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.data = action.payload
    },
    logout: (state) => {
      state.data = {
        token: "",
        user: {
          id: -1,
          created_at: new Date(),
          updated_at: new Date(),
          bio: "",
          avatar: "",
          email: "",
          phone: "",
          company_id: -1,
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
        }
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginWithGoogle.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loginWithGoogle.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = '';
    });
    builder.addCase(loginWithGoogle.rejected, (state, action) => {
      state.loading = false;
      state = initialState;

      state.error = action.error.message;
    });
    builder.addCase(emailLogin.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(emailLogin.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(emailLogin.rejected, (state, action) => {
      state.loading = false;
      state.data = initialState.data
      state.error = action.error.message;
    });
  },
});

export default authenticationSlice.reducer;
export const { logout, setAuth } = authenticationSlice.actions;
