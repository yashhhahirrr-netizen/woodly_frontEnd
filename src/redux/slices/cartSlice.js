import { createSlice } from '@reduxjs/toolkit';

const initialCart = localStorage.getItem('woodly_cart')
  ? JSON.parse(localStorage.getItem('woodly_cart'))
  : [];

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: initialCart,
    isCartOpen: false,
  },
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1, selectedColor } = action.payload;
      const existingItem = state.items.find(
        (item) => item.product._id === product._id && item.selectedColor === selectedColor
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ product, quantity, selectedColor: selectedColor || product.color });
      }

      localStorage.setItem('woodly_cart', JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      const { productId, selectedColor } = action.payload;
      state.items = state.items.filter(
        (item) => !(item.product._id === productId && item.selectedColor === selectedColor)
      );
      localStorage.setItem('woodly_cart', JSON.stringify(state.items));
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((i) => i.product._id === productId);
      if (item) {
        item.quantity = Math.max(1, quantity);
      }
      localStorage.setItem('woodly_cart', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('woodly_cart');
    },
    toggleCartDrawer: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, toggleCartDrawer } =
  cartSlice.actions;
export default cartSlice.reducer;
