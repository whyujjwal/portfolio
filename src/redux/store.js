import { configureStore } from '@reduxjs/toolkit';
import osReducer from './osSlice';

const store = configureStore({
  reducer: {
    os: osReducer,
  },
});

export default store;
