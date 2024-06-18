import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiPath } from "../utils/routes";

export const userApi = createApi({
  reducerPath: "user",
  baseQuery: fetchBaseQuery({
    baseUrl: apiPath,
    tagTypes: ["User"],
  }),

  endpoints: (builder) => ({
    createNewUser: builder.mutation({
      query: (user) => ({
        url: "signup",
        method: "POST",
        body: user,
      }),
    }),
    loginUser: builder.mutation({
      query: (user) => ({
        url: "login",
        method: "POST",
        body: user,
      }),
    }),
  }),
});

export const { useCreateNewUserMutation, useLoginUserMutation } = userApi;
