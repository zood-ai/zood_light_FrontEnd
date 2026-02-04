import './index.css';
import { RouterProvider } from 'react-router-dom';
import './i18n/i18n';
import router from '@/router';
import { BranchProvider } from './context/BranchContext';

export default function App() {
  return (
    <BranchProvider>
      <RouterProvider router={router} />
    </BranchProvider>
  );
}
