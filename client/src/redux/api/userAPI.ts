import { createApi } from "@reduxjs/toolkit/query/react";
import axios from "axios";
import {
  AllUsersResponse,
  DeleteUserRequest,
  ILoginResponse,
  MessageResponse,
  UserResponse,
} from "../../types/api-types";
import { ILogin } from "../../types/types";
import { baseQueryWithAuth } from "../../utils/setAuthHeader";

export const userAPI = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["users"],
  endpoints: (builder) => ({
    login: builder.mutation<ILoginResponse, ILogin>({
      query: (user) => ({
        url: "/api/v1/user/login",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["users"],
    }),
    checkModel: builder.mutation({
      query: () => ({
        url: "/api/v1/user/check-model",
        method: "POST",
      }),
    }),
    chkModel: builder.query({
      query: () => "/api/v1/user/check-model",
    }),
    register: builder.mutation<ILoginResponse, FormData>({
      query: (user) => ({
        url: "/api/v1/user/register",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["users"],
    }),
    logout: builder.mutation<MessageResponse, void>({
      query: () => ({
        url: "/api/v1/user/logout",
        method: "POST",
      }),
      invalidatesTags: ["users"],
    }),

    deleteUser: builder.mutation<MessageResponse, DeleteUserRequest>({
      query: ({ userId, adminUserId }) => ({
        url: `/api/v1/user/${userId}?id=${adminUserId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["users"],
    }),

    allUsers: builder.query<AllUsersResponse, string>({
      query: (id) => `/api/v1/user/all?id=${id}`,
      providesTags: ["users"],
    }),
  }),
});

export const getUser = async (id: string) => {
  try {
    const { data }: { data: UserResponse } = await axios.get(
      `${import.meta.env.VITE_SERVER}/api/v1/user/${id}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const {
  useLoginMutation,
  useAllUsersQuery,
  useDeleteUserMutation,
  useRegisterMutation,
  useLogoutMutation,
  useCheckModelMutation,
  useChkModelQuery,
} = userAPI;
