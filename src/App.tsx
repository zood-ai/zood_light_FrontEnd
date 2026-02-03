import './index.css';
import { RouterProvider } from 'react-router-dom';
import './i18n/i18n';
import router from '@/router';

export default function App() {
  return <RouterProvider router={router} />;
}
