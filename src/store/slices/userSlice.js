import { authApiPaths } from "@/constant/apiPaths";
import api from "@/utils/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const token = localStorage.getItem("accessToken") || null;
const user = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

const initialState = {
  user: user,
  token: token,
  isAuthenticated: token ? true : false,
  loading: false,
  error: null,
};

export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const response = await api.get(authApiPaths.me, {
        headers: { Authorization: `Bearer ${state.user.token}` },
      });
      localStorage.setItem("user", JSON.stringify(response.data));
      // console.log(response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const logoutUser = createAsyncThunk("user/logoutUser", async () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  return null;
});

export const setTokenAndFetchUser = createAsyncThunk(
  "user/setTokenAndFetchUser",
  async (token, thunkAPI) => {
    localStorage.setItem("accessToken", token);
    thunkAPI.dispatch(userSlice.actions.setToken(token));
    await thunkAPI.dispatch(fetchUser());
    return token;
  },
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(setTokenAndFetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(setTokenAndFetchUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(setTokenAndFetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export default userSlice.reducer;
