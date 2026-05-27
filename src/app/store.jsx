import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "../features/User/redux/userApi";
import userReducer from "../features/User/redux/userSlice";
import { carApi } from "../features/Car/redux/carApi"; 
import carReducer from "../features/Car/redux/carSlice";
import { orderApi } from "../features/Order/redux/orderApi"; 

export const store = configureStore({
  reducer: {
  
    [userApi.reducerPath]: userApi.reducer,
    [carApi.reducerPath]: carApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,

    user: userReducer,
    car: carReducer,
    // order: orderReducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userApi.middleware, 
      carApi.middleware, 
      orderApi.middleware
    ),
});