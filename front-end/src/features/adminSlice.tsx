import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "../Interceptor/Interceptor"
type adminType = {
    username: string,
    level: number,
    lastGame: string | null,
    avatar: string,
    status: boolean,
    badge: number | null,
}
const initialState: adminType | undefined = {
    username: "user",
    level: 0,
    lastGame: null,
    avatar: '',
    status: false,
    badge: null
}
export const getAdmin = createAsyncThunk('admin/getAdmin', async () => {
    const response = await axios.get("/Home/MyProfile");
    // console.log("admin/get", response.data)
    //    console.log('axios data notification fetching', response.data);
    return response.data;
});

const Admin = createSlice({
    name: "admin",
    initialState,
    reducers: {
        setUsername: (state: adminType, action: PayloadAction<string>) => {
            if (action.payload !== undefined)
                state.username = action.payload;
        },
        setAvatar: (state: adminType, action: any) => {
            if (action.payload !== undefined)
                state.avatar = action.payload;
        },
        setLevel: (state: adminType, action: any) => {
            if (action.payload !== undefined)
                state.level = action.payload;
        },
        setStatus: (state: adminType, action: PayloadAction<boolean>) => {
            // if (action.payload !== undefined)
                state.status = action.payload;
        },
        setLastGame: (state: adminType, action: any) => {
            if (action.payload !== undefined)
                state.lastGame = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAdmin.pending, (state) => {
                // state.loading = true;
            })
            .addCase(getAdmin.fulfilled, (state, action) => {
                // state.loading = false;
                const { username, level, lastGame, avatar, status, badge } = action.payload;
                state.username = username;
                state.level = level;
                state.lastGame = lastGame;
                state.avatar = avatar;
                state.status = status;
                state.badge = badge;
                // console.log("state a zbi", state);
            })
            .addCase(getAdmin.rejected, (state) => {
                // state.loading = false;
            });
    },
});
export const { setUsername, setAvatar, setLevel, setStatus, setLastGame } = Admin.actions;
export default Admin.reducer;