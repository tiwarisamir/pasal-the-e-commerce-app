import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  AllCouponResponse,
  CreateCouponRequest,
  DeleteCouponRequest,
  MessageResponse,
} from "../../types/api-types";

export const couponAPI = createApi({
  reducerPath: "couponApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/payment/coupon/`,
  }),
  tagTypes: ["coupon"],
  endpoints: (builder) => ({
    createCoupon: builder.mutation<MessageResponse, CreateCouponRequest>({
      query: ({ coupon, amount, userId }) => ({
        url: `new?id=${userId}`,
        method: "POST",
        body: { coupon, amount },
      }),
      invalidatesTags: ["coupon"],
    }),

    deleteCoupon: builder.mutation<MessageResponse, DeleteCouponRequest>({
      query: ({ couponId, adminUserId }) => ({
        url: `${couponId}?id=${adminUserId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["coupon"],
    }),

    allCoupon: builder.query<AllCouponResponse, string>({
      query: (id) => `all?id=${id}`,
      providesTags: ["coupon"],
    }),
  }),
});

export const {
  useCreateCouponMutation,
  useAllCouponQuery,
  useDeleteCouponMutation,
} = couponAPI;
