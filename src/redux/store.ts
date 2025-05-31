import { configureStore } from "@reduxjs/toolkit";
import cartSliceReducer from './slices/cartSlice'
import userReducer from './slices/userSlice'

export const store = configureStore({
    reducer: {
        cart: cartSliceReducer,
        user: userReducer,
    },
})

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

