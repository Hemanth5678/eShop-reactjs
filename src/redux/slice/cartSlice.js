import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cart: {
    items: [],
  },
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addProductToCart: (state, action) => {
      const payload = action.payload;
      const currentIndex = state.cart.items
        .map((item) => item.product.variantSizeId)
        .indexOf(payload.product.variantSizeId);
      if (currentIndex !== -1) {
        state.cart.items[currentIndex] = {
          product: payload.product,
          quantity: state.cart.items[currentIndex].quantity + payload.quantity,
        };
      } else {
        state.cart.items.push({
          product: payload.product,
          quantity: payload.quantity,
        });
      }
    },
    removeProductFromCart: (state, action) => {
      const payload = action.payload;
      const currentIndex = state.cart.items
        .map((item) => item.product.variantSizeId)
        .indexOf(payload.product.variantSizeId);
      if (currentIndex !== -1) {
        state.cart.items.splice(currentIndex, 1);
      }
    },
    inCreaseOneProductInCart: (state, action) => {
      const payload = action.payload;
      const currentIndex = state.cart.items
        .map((item) => item.product.variantSizeId)
        .indexOf(payload.product.variantSizeId);
      if (currentIndex !== -1) {
        state.cart.items[currentIndex] = {
          product: payload.product,
          quantity: state.cart.items[currentIndex].quantity + 1,
        };
      }
    },
    deCreaseOneProductInCart: (state, action) => {
      const payload = action.payload;
      const currentIndex = state.cart.items
        .map((item) => item.product.variantSizeId)
        .indexOf(payload.product.variantSizeId);
      if (currentIndex !== -1) {
        if (state.cart.items[currentIndex].quantity > 1) {
          state.cart.items[currentIndex] = {
            product: payload.product,
            quantity: state.cart.items[currentIndex].quantity - 1,
          };
        }
      }
    },
    clearAllProductInCart: (state, action) => {
      state.cart.items = [];
    },
  },
});

export const {
  addProductToCart,
  removeProductFromCart,
  inCreaseOneProductInCart,
  deCreaseOneProductInCart,
  clearAllProductInCart,
} = cartSlice.actions;

export default cartSlice.reducer;
