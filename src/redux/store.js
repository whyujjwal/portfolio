import { configureStore } from '@reduxjs/toolkit';
import osReducer from './osSlice';

export const store = configureStore({
  reducer: {
    os: osReducer
  }
});
