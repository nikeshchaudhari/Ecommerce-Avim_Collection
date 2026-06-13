import { configureStore } from "@reduxjs/toolkit";
import CartReducer from "../features/cartSlice";
import { CartUi } from "../features/CartUi";


export const store = configureStore({
    reducer:{
        cart:CartReducer,
        cartOpen: CartUi.reducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;