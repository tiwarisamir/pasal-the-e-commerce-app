import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  AllordersResponse,
  MessageResponse,
  NewOrderRequest,
  OrdersDetailsResponse,
  TPayment,
  UpdateOrderRequest,
} from "../../types/api-types";
import { OrderResponse } from "../../types/types";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/order/`,
  }),
  tagTypes: ["orders"],
  endpoints: (builder) => ({
    newOrder: builder.mutation<OrderResponse, NewOrderRequest>({
      query: (order) => ({
        url: "new",
        method: "POST",
        body: order,
      }),
      invalidatesTags: ["orders"],
    }),
    pay: builder.mutation<MessageResponse, TPayment>({
      query: (data) => ({
        url: "pay",
        method: "POST",
        body: data,
      }),
    }),

    updateOrder: builder.mutation<MessageResponse, UpdateOrderRequest>({
      query: ({ userId, orderId }) => ({
        url: `${orderId}?id=${userId}`,
        method: "PUT",
      }),
      invalidatesTags: ["orders"],
    }),

    deleteOrder: builder.mutation<MessageResponse, UpdateOrderRequest>({
      query: ({ userId, orderId }) => ({
        url: `${orderId}?id=${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["orders"],
    }),

    myOrder: builder.query<AllordersResponse, string>({
      query: (id) => `my?id=${id}`,
      providesTags: ["orders"],
    }),

    allOrder: builder.query<AllordersResponse, string>({
      query: (id) => `all?id=${id}`,
      providesTags: ["orders"],
    }),

    orderDetails: builder.query<OrdersDetailsResponse, string>({
      query: (id) => id,
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
