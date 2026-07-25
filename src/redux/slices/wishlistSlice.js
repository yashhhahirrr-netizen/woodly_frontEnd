import { createSlice } from '@reduxjs/toolkit';

const initialWishlist = localStorage.getItem('woodly_wishlist')
  ? JSON.parse(localStorage.getItem('woodly_wishlist'))
  : [];

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: initialWishlist,
  },
  reducers: {
    toggleWishlist: (state, action) => {
      const product = action.payload;
      const index = state.items.findIndex((item) => item._id === product._id);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push(product);
      }
      localStorage.setItem('woodly_wishlist', JSON.stringify(state.items));
    },
  },
});

export const { toggleWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
