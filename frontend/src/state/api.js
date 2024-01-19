import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const baseUrl = "/";
export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl }),
  reducerPath: "adminApi",
  tagTypes: ["basicData"],
  endpoints: (build) => ({
    getDataDayMetallic: build.query({
      query: (dateToday) =>
        `api/metallic/day${dateToday ? `?fecha=${dateToday}` : ""}`,
      providesTags: ["basicData"],
    }),
    getDataMonthMetallic: build.query({
      query: (dateToday) =>
        `api/metallic/month${dateToday ? `?fecha=${dateToday}` : ""}`,
      providesTags: ["basicData"],
    }),
    getDataWeekMetallic: build.query({
      query: (dateToday) =>
        `api/metallic/week${dateToday ? `?fecha=${dateToday}` : ""}`,
      providesTags: ["basicData"],
    }),
    getDataDayPaint: build.query({
      query: (dateToday) =>
        `api/paint/day${dateToday ? `?fecha=${dateToday}` : ""}`,
      providesTags: ["basicData"],
    }),
    getDataMonthPaint: build.query({
      query: (dateToday) =>
        `api/paint/month${dateToday ? `?fecha=${dateToday}` : ""}`,
      providesTags: ["basicData"],
    }),
    getDataWeekPaint: build.query({
      query: (dateToday) =>
        `api/paint/week${dateToday ? `?fecha=${dateToday}` : ""}`,
      providesTags: ["basicData"],
    }),
  }),
});

export const {
  useLazyGetDataDayMetallicQuery,
  useLazyGetDataMonthMetallicQuery,
  useLazyGetDataWeekMetallicQuery,
  useLazyGetDataDayPaintQuery,
  useLazyGetDataMonthPaintQuery,
  useLazyGetDataWeekPaintQuery,
} = api;
