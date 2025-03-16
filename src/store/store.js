import { configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk"; 
import userReducer from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export default store;
