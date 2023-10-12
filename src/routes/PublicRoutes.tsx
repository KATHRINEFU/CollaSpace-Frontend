import { RouteObject } from "react-router-dom";
import { Login } from "../pages/public/Login";
import { SignUp } from "../pages/public/Signup";
import { ForgotPassword } from "../pages/public/ForgotPassword";
import { ResetPassword } from "../pages/public/ResetPassword";

export const PublicRoutes: RouteObject[] = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
];
