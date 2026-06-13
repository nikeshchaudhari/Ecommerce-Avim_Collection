import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  quantity: number;
  size: string;
  color: string;
  photo: string;
}

export const Cart = createSlice({
  name: "cart",
  initialState: {
    items: [] as Product[],
  },
  reducers: {
    addToCart: (
      state: { items: Product[] },
      action: PayloadAction<Product>,
    ) => {
      const item = action.payload;

      const existing = state.items.find(
        (cartItem) =>
          cartItem.id === item.id &&
          cartItem.size === item.size &&
          cartItem.color === item.color,
      );

      if (existing) {
        const newQuantity = existing.quantity + item.quantity;

        existing.quantity = newQuantity > item.stock ? item.stock : newQuantity;
      } else {
        state.items.push(item);
      }
    },

    // increase
    increaseQuantity: (
      state,
      action: PayloadAction<{
        stock: number;
        quantity: number;
        id: number;
        size: string;
        color: string;
      }>,
    ) => {
      const item = action.payload;
      const existing = state.items.find(
        (i) =>
          i.id === item.id && i.size === item.size && i.color === item.color,
      );

      if (existing && existing.quantity < item.stock) {
        existing.quantity += 1;
      }
    },

    // decrease

    decreaseQuantiy: (
      state,
      action: PayloadAction<{ id: number; color: string; size: string }>,
    ) => {
      const item = action.payload;

      const existing = state.items.find(
        (i) =>
          i.id === item.id && i.size === item.size && i.color === item.color,
      );

      if (existing && existing.quantity > 1) {
        existing.quantity -= 1;
      }
    },
  },
});

export const { addToCart } = Cart.actions;
export default Cart.reducer;
