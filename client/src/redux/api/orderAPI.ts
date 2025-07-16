import { createApi } from "@reduxjs/toolkit/query/react";
import {
  AllordersResponse,
  MessageResponse,
  NewOrderRequest,
  OrdersDetailsResponse,
  UpdateOrderRequest,
} from "../../types/api-types";
import { baseQueryWithAuth } from "../../utils/setAuthHeader";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["orders"],
  endpoints: (builder) => ({
    newOrder: builder.mutation<MessageResponse, NewOrderRequest>({
      query: (order) => ({
        url: "/api/v1/order/new",
        method: "POST",
        body: order,
      }),
      invalidatesTags: ["orders"],
    }),
    pay: builder.mutation<MessageResponse, NewOrderRequest>({
      query: (data) => ({
        url: "/api/v1/order/pay",
        method: "POST",
        body: data,
      }),
    }),

    updateOrder: builder.mutation<MessageResponse, UpdateOrderRequest>({
      query: ({ userId, orderId }) => ({
        url: `/api/v1/order/${orderId}?id=${userId}`,
        method: "PUT",
      }),
      invalidatesTags: ["orders"],
    }),

    deleteOrder: builder.mutation<MessageResponse, UpdateOrderRequest>({
      query: ({ userId, orderId }) => ({
        url: `/api/v1/order/${orderId}?id=${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["orders"],
    }),

    myOrder: builder.query<AllordersResponse, string>({
      query: (id) => `/api/v1/order/my?id=${id}`,
      providesTags: ["orders"],
    }),

    allOrder: builder.query<AllordersResponse, string>({
      query: (id) => `/api/v1/order/all?id=${id}`,
      providesTags: ["orders"],
    }),

    orderDetails: builder.query<OrdersDetailsResponse, string>({
      query: (id) => `/api/v1/order/${id}`,
      providesTags: ["orders"],
    }),
  }),
});

export const {
  useNewOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useMyOrderQuery,
  useAllOrderQuery,
  useOrderDetailsQuery,
  usePayMutation,
} = orderApi;
