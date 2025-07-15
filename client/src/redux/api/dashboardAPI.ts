import { createApi } from "@reduxjs/toolkit/query/react";
import {
  BarResponse,
  LineResponse,
  PieResponse,
  StatsResponse,
} from "../../types/api-types";
import { baseQueryWithAuth } from "../../utils/setAuthHeader";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: baseQueryWithAuth,

  endpoints: (builder) => ({
    stats: builder.query<StatsResponse, string>({
      query: (id) => `/api/v1/dashboard/stats?id=${id}`,
      keepUnusedDataFor: 0,
    }),

    pie: builder.query<PieResponse, string>({
      query: (id) => `/api/v1/dashboard/pie?id=${id}`,
      keepUnusedDataFor: 0,
    }),

    bar: builder.query<BarResponse, string>({
      query: (id) => `/api/v1/dashboard/bar?id=${id}`,
      keepUnusedDataFor: 0,
    }),

    line: builder.query<LineResponse, string>({
      query: (id) => `/api/v1/dashboard/line?id=${id}`,
      keepUnusedDataFor: 0,
    }),
  }),
});

export const { useStatsQuery, usePieQuery, useBarQuery, useLineQuery } =
  dashboardApi;
