import { apiSlice } from "../api/apiSlice";

// 定义我们的单个 API Slice 对象
export const userApiSlice = apiSlice.injectEndpoints({
      endpoints: (builder) => ({
        // `getPosts` endpoint 是一个返回数据的 “Query” 操作
        getAllEmployees: builder.query({
          query: () => `/employee/all`,
        }),
        getEmployeeTeams: builder.query({
          query: (employeeId) => `/employee/teams/${employeeId}`,
        }),
        getClient: builder.query({
          query: (clientId) => `/account/withcompany/${clientId}`,
        }),
        getEvents: builder.query({
          query: (teamId) => `/event/byteam/${teamId}`,
        }),
        getTicketsByEmployee: builder.query({
          query: (employeeId) => `/ticket/employee/${employeeId}`,
        }),
        getTicketsByTeam: builder.query({
          query: (teamId) => `/ticket/team/${teamId}`,
        }),
        getAllTeams: builder.query({
          query: () => `/team/`,
        }),
        getEmployeeDetail: builder.query({
          query: (employeeId) => `/employee/${employeeId}`,
        }),
        getAllAccounts: builder.query({
          query: () => `/account/all`,
        }),
        getEmployeeAccounts: builder.query({
          query: (employeeId) => `/account/byemployee/${employeeId}`,
        }),
        getTeam: builder.query({
          query: (teamId) => `/team/${teamId}`,
        }),
        getTeamAccounts: builder.query({
          query: (teamId) => `/team/accounts/${teamId}`,
        }),
        getDepartmentAccounts: builder.query({
          query: (departmentId) => `/account/bydepartment/${departmentId}`,
        }),
        getTeamAnnouncementInSevenDays: builder.query({
          query: (teamId) => `/team/announcement/sevendays/byteam/${teamId}`,
        }),
        getTeamMembers: builder.query({
          query: (teamId) => `/team/members/${teamId}`,
        }),
      }),
  });
  
  // 为 `getPosts` Query endpoint 导出自动生成的 hooks
  export const {
    useGetAllEmployeesQuery,
    useGetEmployeeTeamsQuery,
    useGetClientQuery,
    useGetEventsQuery,
    useGetTicketsByEmployeeQuery,
    useGetTicketsByTeamQuery,
    useGetAllTeamsQuery,
    useGetEmployeeDetailQuery,
    useGetAllAccountsQuery,
    useGetEmployeeAccountsQuery,
    useGetTeamQuery,
    useGetTeamAccountsQuery,
    useGetDepartmentAccountsQuery,
    useGetTeamAnnouncementInSevenDaysQuery,
    useGetTeamMembersQuery,
  } = userApiSlice;