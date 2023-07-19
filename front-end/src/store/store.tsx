import { configureStore } from "@reduxjs/toolkit"
import userReducer from "../features/usersSlice"
import notificationReducer from "../features/notificationsSlice"
import messageReducer from "../features/messageSlice"
import adminReducer from "../features/adminSlice"
import isLoading from "../features/isLoading"
import TwoFa from "../features/2FA"

const store = configureStore({
    reducer:{
        users: userReducer,
        notification: notificationReducer,
        messages: messageReducer,
        admin : adminReducer,
        isLoading,
        TwoFa,
        
    },
})
export default  store;
export type AppDispatch = typeof store.dispatch