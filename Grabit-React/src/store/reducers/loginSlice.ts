import loginUser from "@/servers/auth";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface User {
  id: string;
  email: string;
  name: string;
  token: string;
}

interface LoginState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// الحالة الأولية
const initialState: LoginState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// دالة Async لتسجيل الدخول باستخدام Thunk
export const loginUserAsync = createAsyncThunk(
  "login/loginUser",
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    const user = await loginUser(email, password);

    // ✅ التحقق من وجود `user` و `token`
    if (!user || !user.token) {
      return rejectWithValue("Invalid email, password, or missing token");
    }

    return user; // ✅ إرجاع `user` مباشرةً بدلاً من `user.user`
  }
);

// إنشاء Reducer
const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = loginSlice.actions;
export default loginSlice.reducer;
