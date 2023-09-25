import { RouteObject } from "react-router-dom";

export const UserRoutes: RouteObject[] = [
  {
    path: "/user/dashboard",
    lazy: () => import("../pages/user/Dashboard"),
  },
];