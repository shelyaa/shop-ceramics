import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface CartItem {
  id: string;
  qty: number;
  priceInCents: number;
}

interface CartState {
  loading: boolean;
  cartItems: CartItem[];
  itemsPrice?: string;
  shippingPrice?: string;
  totalPrice?: string;
}

const getInitialState = (): CartState => {
  const cookieCart = Cookies.get("cart");
  if (cookieCart) {
    return { ...JSON.parse(cookieCart), loading: true };
  }
  return {
    loading: true,
    cartItems: [],
  };
};

const addDecimals = (num: number): string => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

const cartSlice = createSlice({
  name: "cart",
  initialState: getInitialState(),
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x.id === item.id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x.id === existItem.id ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }

      const itemsPrice = state.cartItems.reduce(
        (acc, item) => acc + item.priceInCents * item.qty,
        0
      );

      state.itemsPrice = addDecimals(itemsPrice);
      state.shippingPrice = addDecimals(itemsPrice > 10000 ? 0 : 100);
      state.totalPrice = addDecimals(
        Number(state.itemsPrice) + Number(state.shippingPrice)
      );

      Cookies.set("cart", JSON.stringify(state));
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter((x) => x.id !== action.payload);

      const itemsPrice = state.cartItems.reduce(
        (acc, item) => acc + item.priceInCents * item.qty,
        0
      );

      state.itemsPrice = addDecimals(itemsPrice);
      state.shippingPrice = addDecimals(itemsPrice > 10000 ? 0 : 100);
      state.totalPrice = addDecimals(
        Number(state.itemsPrice) + Number(state.shippingPrice)
      );

      Cookies.set("cart", JSON.stringify(state));
    },

    hideLoading: (state) => {
      state.loading = false;
    },
  },
});

export const { addToCart, removeFromCart, hideLoading } = cartSlice.actions;
export default cartSlice.reducer;
