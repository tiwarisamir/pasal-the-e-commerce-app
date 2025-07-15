import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { MessageResponse } from "../types/api-types";
import { SerializedError } from "@reduxjs/toolkit";
import { NavigateFunction } from "react-router-dom";
import toast from "react-hot-toast";
import moment from "moment";
import Cookies from "js-cookie";
import { IUser } from "../types/types";

type ResType =
  | {
      data: MessageResponse;
      error?: undefined;
    }
  | {
      data?: undefined;
      error: FetchBaseQueryError | SerializedError;
    };

export const responseToast = (
  res: ResType,
  navigate: NavigateFunction | null,
  url: string
) => {
  if ("data" in res) {
    toast.success(res.data!.message);
    if (navigate) navigate(url);
  } else {
    const error = res.error as FetchBaseQueryError;
    const MessageResponse = error.data as MessageResponse;
    toast.error(MessageResponse.message);
  }
};

export const getLastMonths = () => {
  const currentDate = moment();

  currentDate.date(1);

  const last6Months: string[] = [];
  const last12Months: string[] = [];

  for (let i = 0; i < 6; i++) {
    const monthDate = currentDate.clone().subtract(i, "months");
    const monthName = monthDate.format("MMM");

    last6Months.unshift(monthName);
  }

  for (let i = 0; i < 12; i++) {
    const monthDate = currentDate.clone().subtract(i, "months");
    const monthName = monthDate.format("MMM");

    last12Months.unshift(monthName);
  }
  return {
    last12Months,
    last6Months,
  };
};

export const setAccessToken = (token: string) => {
  Cookies.set("access-token", token, { expires: 1 });
};

export const setUserDetails = (tokenInfo: IUser) => {
  Cookies.set("User", JSON.stringify(tokenInfo), { expires: 1 });
};

export const getAccessToken = () => {
  const accessToken = Cookies.get("access-token");

  if (accessToken) return accessToken;
  else return null;
};

export const getUserDetail = () => {
  const User = Cookies.get("User");

  if (User) {
    return JSON.parse(User) as IUser;
  }
  return null;
};
