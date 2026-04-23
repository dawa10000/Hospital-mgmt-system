import { configureStore } from "@reduxjs/toolkit";
import { mainApi } from "./mainApi.js";
import { userSlice } from "../features/users/userSlice.js";


export const store = configureStore({
  reducer: {
    [userSlice.name]: userSlice.reducer,
    [mainApi.reducerPath]: mainApi.reducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(mainApi.middleware)
})