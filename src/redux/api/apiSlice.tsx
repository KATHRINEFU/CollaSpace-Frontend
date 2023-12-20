// 从特定于 React 的入口点导入 RTK Query 方法
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";


const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8080",
  // crendentials: "include" will face CORS if credential is not provided
  credentials: "same-origin", 
  prepareHeaders: (headers) => {
      const accessToken = localStorage.getItem("token");
      if (accessToken) {
          headers.set("authorization", `Bearer ${accessToken}`);
          headers.set("Content-Type", "application/json");
      }

      return headers;
  },
});


export const baseQueryWithReAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  return await baseQuery(args, api, extraOptions);
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReAuth,
  endpoints: () => ({}),
  tagTypes: ['User', 'Team', 'Announcement', 'Employee', 'Account'],
});
