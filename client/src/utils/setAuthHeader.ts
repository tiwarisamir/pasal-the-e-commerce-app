import { BaseQueryFn, fetchBaseQuery } from "@reduxjs/toolkit/query";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { FetchArgs } from "@reduxjs/toolkit/query";
import { getAccessToken } from "./features";

export const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  { baseUrl?: string }
> = async (args, api, extraOptions) => {
  const baseUrl = extraOptions?.baseUrl || `${import.meta.env.VITE_SERVER}`;
  const baseQuery = fetchBaseQuery({ baseUrl });

  const accessToken = getAccessToken();

  const fetchArgs: FetchArgs =
    typeof args === "string" ? { url: args } : { ...args };

  const headers: Record<string, string> = fetchArgs.headers
    ? fetchArgs.headers instanceof Headers
      ? Object.fromEntries(fetchArgs.headers.entries())
      : Array.isArray(fetchArgs.headers)
      ? Object.fromEntries(fetchArgs.headers)
      : fetchArgs.headers
    : {};

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  fetchArgs.headers = headers;
  const result = await baseQuery(fetchArgs, api, extraOptions);

  return result;
};
