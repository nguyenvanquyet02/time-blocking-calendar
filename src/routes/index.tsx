import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { lazy } from 'react';
import UserPage from '../pages/UserPage';

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
    ],
  },
]);

export default router;
