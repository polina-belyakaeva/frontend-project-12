import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ROUTES } from "../utils/routes";
import authHeader from "./authHeader";

export const channelsApi = createApi({
  reducerPath: "channels",
  baseQuery: fetchBaseQuery({
    baseUrl: API_ROUTES.channels(),
    prepareHeaders: authHeader,
  }),
  tagTypes: ["Channels"],
  endpoints: (builder) => ({
    getChannels: builder.query({
      query: () => "",
    }),
    addChannel: builder.mutation({
      query: (channel) => ({
        method: "POST",
        body: channel,
      }),
    }),
    editChannel: builder.mutation({
      query: (newChannel) => ({
        method: "PATCH",
        url: newChannel.id,
        body: newChannel,
      }),
    }),
    removeChannel: builder.mutation({
      query: (id) => ({
        url: id,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useGetChannelsQuery, useAddChannelMutation, useEditChannelMutation, useRemoveChannelMutation } = channelsApi;
