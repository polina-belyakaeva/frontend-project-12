import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../authSlice.js";
import channelsReducer from "../uiSlice";
import { channelsApi } from "../../api/channelsApi";
import { messagesApi } from "../../api/messagesApi";

export default configureStore({
  reducer: {
    auth: authReducer,
    ui: channelsReducer,
    [channelsApi.reducerPath]: channelsApi.reducer,
    [messagesApi.reducerPath]: messagesApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(channelsApi.middleware, messagesApi.middleware),
});
