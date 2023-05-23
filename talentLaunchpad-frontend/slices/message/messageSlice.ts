import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import UNIVERSAL from '../../config/config';

type InitialState = {
    data: any,
    allConversation: any[],
    error: string
    loading: boolean
}

const initialState: InitialState = {
    data: [],
    allConversation: [],
    error: "",
    loading: false
}

type SendMessagePayload = {
    fromCompany: number | null,
    toUser: number | null,
    fromUser: number | null,
    toCompany: number | null,
    message: string,
    token: string
}

export const sendMessage = createAsyncThunk(
    '/message/sendMessage',
    (data: SendMessagePayload, { rejectWithValue }) => {
        return fetch(`${UNIVERSAL.BASEURL}/api/message/send`, {
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

type GetChatPayload = {
    token: string,
    companyId: number,
    userId: number
}

export const getChat = createAsyncThunk(
    '/message/getChat',
    (data: GetChatPayload, { rejectWithValue }) => {
        return fetch(`${UNIVERSAL.BASEURL}/api/message/get_chat`, {
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

type GetAllCandidateConversation = {
    token: string
}

export const getAllCandidateConversation = createAsyncThunk(
    '/message/getAllCandidateConversation',
    (data: GetAllCandidateConversation, { rejectWithValue }) => {
        return fetch(`${UNIVERSAL.BASEURL}/api/message/get_all_candidate_conversation`, {
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

type GetAllEmployerConversation = {
    companyId: number,
    token: string
}

export const getAllEmployerConversation = createAsyncThunk(
    '/message/getAllEmployerConversation',
    (data: GetAllEmployerConversation, { rejectWithValue }) => {
        return fetch(`${UNIVERSAL.BASEURL}/api/message/get_all_employer_conversation`, {
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


const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(getAllEmployerConversation.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getAllEmployerConversation.fulfilled, (state, action) => {
            state.loading = false;
            state.allConversation = action.payload;
            state.error = ""
        });
        builder.addCase(getAllEmployerConversation.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message!;
        });
        builder.addCase(getAllCandidateConversation.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getAllCandidateConversation.fulfilled, (state, action) => {
            state.loading = false;
            state.allConversation = action.payload;
            state.error = ""
        });
        builder.addCase(getAllCandidateConversation.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message!;
        });
        builder.addCase(sendMessage.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(sendMessage.fulfilled, (state, action) => {
            state.loading = false;
            // state.data = action.payload;
            state.error = ""
        });
        builder.addCase(sendMessage.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message!;
        });
        builder.addCase(getChat.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getChat.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
            state.error = ""
        });
        builder.addCase(getChat.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message!;
        });

    },
});

export default messageSlice.reducer;