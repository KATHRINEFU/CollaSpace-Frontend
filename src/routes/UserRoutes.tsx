import { RouteObject } from "react-router-dom";

export const UserRoutes: RouteObject[] = [
  {
    path: "/user/dashboard",
    lazy: () => import("../pages/user/Dashboard"),
  },
  {
    path: "/user/create-event",
    lazy: () => import("../pages/user/CreateEvent"),
  },
  {
    path: "/user/create-ticket",
    lazy: () => import("../pages/user/CreateTicket"),
  },
  {
    path: "/user/create-team",
    lazy: () => import("../pages/user/CreateTeam"),
  },
  {
    path: "/user/events",
    lazy: () => import("../pages/user/AllEvents"),
  },

];