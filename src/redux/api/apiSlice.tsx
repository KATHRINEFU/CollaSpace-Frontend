import type {
    BaseQueryApi,
    QueryReturnValue,
  } from "@reduxjs/toolkit/dist/query/baseQueryTypes";
  import {
    createApi,
    FetchArgs,
    fetchBaseQuery,
    FetchBaseQueryError,
    FetchBaseQueryMeta,
  } from "@reduxjs/toolkit/query/react";
  import { getUser } from "../../utils/localStorage";
  import { RootState } from "../store";
  import { logOut, setCredentials } from "../auth/authSlice";
  import Cookies from "js-cookie";
  import { HTTP, IUser} from "../../types";
  import { CS_TOKEN } from "../../utils/constants";
  
  interface RefreshResult {
    data: {
      data: {
        accessToken: string;
      }
    }
  }
  
  const baseQuery = fetchBaseQuery({
    baseUrl: "",
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = "";
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  });
  
  const baseQueryWithReAuth = async (
    args: string | FetchArgs,
    api: BaseQueryApi,
    extraOptions: Record<string, unknown>
  ): Promise<
    QueryReturnValue<unknown, FetchBaseQueryError, FetchBaseQueryMeta>
  > => {
    let result = await baseQuery(args, api, extraOptions);
    // TODO: Add refresh to refresh token
    if (result?.error?.status === 401 || result?.error?.status === 403) {
      const refreshResult = await baseQuery(
        {
          url: "/auth/refresh",
          body: { accessToken: Cookies.get(CS_TOKEN) },
          method: HTTP.POST,
        },
        api,
        extraOptions
      ) as RefreshResult;
  
      if (refreshResult?.data) {
        const state = api.getState() as RootState;
        const user = state.auth.user ?? getUser();
        api.dispatch(
          setCredentials({
            user: {
              ...(user as IUser),
              token: refreshResult.data.data.accessToken
            },
          })
        );
        // retry
        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logOut());
        window.location.reload();
      }
    }
    return result;
  };
  
  export const apiSlice = createApi({
    baseQuery: baseQueryWithReAuth,
    endpoints: () => ({}),
    tagTypes: [
      "User",
    ],
  });
  