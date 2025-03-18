import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login } from 'src/services/auth';

interface AuthState {
    user: any;
    token: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: typeof window !== 'undefined' && localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user')!)
        : null,
    token: typeof window !== 'undefined' ? localStorage.getItem('token') || null : null,
    loading: false,
    error: null
};


// ** Thunk for user login **
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await login(email, password);
            localStorage.setItem('user', JSON.stringify(response.user));
            localStorage.setItem('token', response.token);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

// ** Auth Slice **
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logoutUser: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export const { logoutUser } = authSlice.actions;
export default authSlice.reducer;
