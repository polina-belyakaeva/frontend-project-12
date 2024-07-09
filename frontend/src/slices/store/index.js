import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../authSlice';
import channelsReducer from '../uiSlice';
import modalReducer from '../modalSlice';
import { channelsApi } from '../../api/channelsApi';
import { messagesApi } from '../../api/messagesApi';
import { userApi } from '../../api/userApi';

export default configureStore({
  reducer: {
    auth: authReducer,
    ui: channelsReducer,
    modal: modalReducer,
    [channelsApi.reducerPath]: channelsApi.reducer,
    [messagesApi.reducerPath]: messagesApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  // prettier-ignore
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    .concat(
      channelsApi.middleware,
      messagesApi.middleware,
      userApi.middleware,
    ),
});
