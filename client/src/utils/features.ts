import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { MessageResponse } from "../types/api-types";
import { SerializedError } from "@reduxjs/toolkit";
import { NavigateFunction } from "react-router-dom";
import toast from "react-hot-toast";
import moment from "moment";

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

export const isAdult = (dob: Date) => {
  const today = new Date();

  let age = today.getFullYear() - dob.getFullYear();

  if (age < 18) return false;
  else if (age > 18) return true;
  else if (
    today.getMonth() < dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
  )
    return false;
  else {
    return true;
  }
};
