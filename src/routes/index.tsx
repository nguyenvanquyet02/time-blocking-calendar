import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { lazy } from "react";
import { ProtectedRoute } from "./ProtectedRoute";

const HomePage = lazy(() => import("../pages/HomePage"));
const CalendarPage = lazy(() => import("../pages/CalendarPage"));
const UserPage = lazy(() => import("../pages/UserPage"));
const PostPage = lazy(() => import("../pages/PostPage"));
const ProductsPage = lazy(() => import("../pages/ProductsPage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const RegisterPage = lazy(() => import("../pages/RegisterPage"));
const LearnFormControl = lazy(() => import("../pages/LearnFormControl"));
const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/calendar" replace />,
      },
      {
        path: "home",
        element: <HomePage />,
      },
      {
        path: "calendar",
        element: (
          // chi cho phep da login
          <ProtectedRoute>
            <CalendarPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "users",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <UserPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "posts",
        element: (
          <ProtectedRoute allowedRoles={["user"]}>
            <PostPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "products",
        element: (
          <ProtectedRoute allowedRoles={["manager"]}>
            <ProductsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "learn-form-control",
        element: (
          <ProtectedRoute>
            <LearnFormControl />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;
