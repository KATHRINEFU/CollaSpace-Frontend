import { HTTP } from "../../types";
import { apiSlice } from "../api/apiSlice";

export const authApiSplice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTokens: builder.mutation<any, any>({
      query: (body) => ({
        url: "/auth/google",
        method: HTTP.POST,
        body,
      }),
    }),
  }),
});

export const {
  useGetTokensMutation,
} = authApiSplice;
