import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_ROUTES } from '../utils/routes';
import authHeader from './authHeader';

export const messagesApi = createApi({
  reducerPath: 'messages',
  baseQuery: fetchBaseQuery({
    baseUrl: API_ROUTES.messages(),
    prepareHeaders: authHeader,
    providesTags: ['Channels', 'Messages'],
  }),
  tagTypes: ['Messages'],
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: () => '',
    }),
    addMessage: builder.mutation({
      query: (message) => ({
        method: 'POST',
        body: message,
      }),
    }),
    editMessage: builder.mutation({
      query: (editedMessage) => ({
        method: 'PATCH',
        body: editedMessage,
      }),
    }),
    removeMessage: builder.mutation({
      query: (channelId) => ({
        url: `channel/${channelId}`,
        method: 'DELETE',
      }),
      providesTags: ['Channels', 'Messages'],
    }),
  }),
});

export const {
  useGetMessagesQuery,
  useAddMessageMutation,
  useEditMessageMutation,
  useRemoveMessageMutation,
} = messagesApi;
