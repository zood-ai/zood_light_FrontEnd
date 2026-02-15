import './index.css';
import { RouterProvider } from 'react-router-dom';
import router from '@/router';
import { BranchProvider } from './context/BranchContext';

export default function App() {
  return (
    <BranchProvider>
      <RouterProvider router={router} />
    </BranchProvider>
  );
}
