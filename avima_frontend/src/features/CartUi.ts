import { createSlice } from "@reduxjs/toolkit";

export const CartUi = createSlice({
  name: "cartui",
  initialState: {
    items: [],
    isOpen: false,
  },
  reducers: {
    openCart: (state) => {
      state.isOpen = true;
    },
    closeCart: (state) => {
      state.isOpen = false;
    },
    toogleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { openCart, closeCart, toogleCart } = CartUi.actions;
export default CartUi.reducer;
