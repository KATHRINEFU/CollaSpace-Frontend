// 从特定于 React 的入口点导入 RTK Query 方法
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// 定义我们的单个 API Slice 对象
export const apiSlice = createApi({
  // 缓存减速器预计将添加到 `state.api` （已经默认 - 这是可选的）
  reducerPath: 'api',
  // 我们所有的请求都有以 “/fakeApi” 开头的 URL
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.BASE_URL }),
  // “endpoints” 代表对该服务器的操作和请求
  endpoints: builder => ({
    // `getPosts` endpoint 是一个返回数据的 “Query” 操作
    getEmployeeDashboard: builder.query({
      // 请求的 URL 是“/fakeApi/posts”
      query: () => '/employee/dashboard'
    })
  })
})

// 为 `getPosts` Query endpoint 导出自动生成的 hooks
export const { useGetEmployeeDashboardQuery } = apiSlice