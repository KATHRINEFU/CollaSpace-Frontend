import { createBrowserRouter } from "react-router-dom";
import { PublicRoutes } from "./PublicRoutes";
import DefaultLayout from "../components/layouts/DefaultLayout";
import ErrorBoundary from "../components/ErrorBoundary";
export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ErrorBoundary>
        <DefaultLayout />
      </ErrorBoundary>
    )
    ,
    children: PublicRoutes,
  },
  
]);