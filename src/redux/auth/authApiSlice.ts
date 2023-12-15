import { HTTP } from "../../types";
import { apiSlice } from "../api/apiSlice";
import { ISignIn } from "../../types";

export const authApiSplice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signIn: builder.mutation<any, ISignIn>({
      query: (body) => ({
        url: body?.token ? "/auth/google/sign-in" : "/employee/login",
        method: HTTP.POST,
        body,
      }),
    }),
    signUp: builder.mutation<any, any>({
      query: (body) => ({
        url: "/auth/register",
        method: HTTP.POST,
        body,
      }),
    }),
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
  useSignInMutation, 
  useSignUpMutation, 
  useGetTokensMutation } =
  authApiSplice;
