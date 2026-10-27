import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { lazy } from 'react';
import UserPage from '../pages/UserPage';
import PostPage from '../pages/PostPage';
import ProductsPage from '../pages/ProductsPage';

const HomePage = lazy(() => import('../pages/HomePage')
)
const CalendarPage = lazy(() => import('../pages/CalendarPage')
)
const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/calendar" replace />,
      },
      {
        path: 'home',
        element: <HomePage />,
      },
      {
        path: 'calendar',
        element: <CalendarPage />,
      },
      {
        path: 'users',
        element: <UserPage />,
      },
      {
        path: 'posts',
        element: <PostPage />,
      },
      {
        path: 'products',
        element: <ProductsPage />,
      },
    ],
  },
]);

export default router;
