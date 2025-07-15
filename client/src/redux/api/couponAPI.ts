import { createApi } from "@reduxjs/toolkit/query/react";
import {
  AllCouponResponse,
  CreateCouponRequest,
  DeleteCouponRequest,
  MessageResponse,
} from "../../types/api-types";
import { baseQueryWithAuth } from "../../utils/setAuthHeader";

export const couponAPI = createApi({
  reducerPath: "couponApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["coupon"],
  endpoints: (builder) => ({
    createCoupon: builder.mutation<MessageResponse, CreateCouponRequest>({
      query: ({ coupon, amount, userId }) => ({
        url: `/api/v1/payment/coupon/new?id=${userId}`,
        method: "POST",
        body: { coupon, amount },
      }),
      invalidatesTags: ["coupon"],
    }),

    deleteCoupon: builder.mutation<MessageResponse, DeleteCouponRequest>({
      query: ({ couponId, adminUserId }) => ({
        url: `/api/v1/payment/coupon/${couponId}?id=${adminUserId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["coupon"],
    }),

    allCoupon: builder.query<AllCouponResponse, string>({
      query: (id) => `/api/v1/payment/coupon/all?id=${id}`,
      providesTags: ["coupon"],
    }),
  }),
});

export const {
  useCreateCouponMutation,
  useAllCouponQuery,
  useDeleteCouponMutation,
} = couponAPI;
