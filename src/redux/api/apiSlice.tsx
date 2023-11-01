// 从特定于 React 的入口点导入 RTK Query 方法
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// 定义我们的单个 API Slice 对象
export const apiSlice = createApi({
  // 缓存减速器预计将添加到 `state.api` （已经默认 - 这是可选的）
  reducerPath: "api",
  // 我们所有的请求都有以 “” 开头的 URL
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8080" }),
  // “endpoints” 代表对该服务器的操作和请求
  endpoints: (builder) => ({
    // `getPosts` endpoint 是一个返回数据的 “Query” 操作
    getEmployeeTeams: builder.query({
      query: (employeeId) => `/employee/teams/${employeeId}`,
    }),

    getClient: builder.query({
      query: (clientId) => `/account/withcompany/${clientId}`,
    }),

    getEvents: builder.query({
      query: (teamId) => `/event/byteam/${teamId}`,
    }),
    getTickets: builder.query({
      query: (employeeId) => `/ticket/employee/${employeeId}`,
    }),
    getAllTeams: builder.query({
      query: () => `/team/`,
    }),
    getEmployeeDetail: builder.query({
      query: (employeeId) => `/employee/${employeeId}`,
    }),
  }),
});

// 为 `getPosts` Query endpoint 导出自动生成的 hooks
export const {
  useGetEmployeeTeamsQuery,
  useGetClientQuery,
  useGetEventsQuery,
  useGetTicketsQuery,
  useGetAllTeamsQuery,
  useGetEmployeeDetailQuery,
} = apiSlice;
