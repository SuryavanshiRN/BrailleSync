import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import TranslationPage from './pages/TranslationPage';
import HistoryPage from './pages/HistoryPage';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    element: <LandingPage />,
    visible: true,
  },
  {
    name: 'Dashboard',
    path: '/dashboard',
    element: <DashboardPage />,
    visible: true,
  },
  {
    name: 'Translate',
    path: '/translate',
    element: <TranslationPage />,
    visible: true,
  },
  {
    name: 'History',
    path: '/history',
    element: <HistoryPage />,
    visible: true,
  },
];

export default routes;
