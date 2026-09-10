import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/HomePage';
import CalendarPage from '../pages/CalendarPage';

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
    ],
  },
]);

export default router;
