import { createBrowserRouter } from "react-router-dom";
import { PublicRoutes } from "./PublicRoutes";
import DefaultLayout from "../components/layouts/DefaultLayout";
import ErrorBoundary from "../components/ErrorBoundary";
import UserLayout from "../components/layouts/UserLayout";
// import AuthProvider from "../providers/AuthProvider";
import { UserRoutes } from "./UserRoutes";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ErrorBoundary>
        <DefaultLayout />
      </ErrorBoundary>
    ),
    children: PublicRoutes,
  },

  {
    path: "/user",
    element: (
      // <AuthProvider>
      <ErrorBoundary>
        <UserLayout />
      </ErrorBoundary>
      // </AuthProvider>
    ),
    children: UserRoutes,
  },
]);
