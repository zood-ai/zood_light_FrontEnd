import { useEffect } from 'react';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import './i18n/i18n';
import router from '@/router';

export default function App() {
  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    const isMobileUA = /iPhone|iPad|iPod|Android/i.test(userAgent);

    // Feature detection: Check if touch is supported
    // const isTouchDevice =
    //   'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (isMobileUA) {
      window.location.href = 'https://zood-e-invoice-flutter.vercel.app/';
    }
  }, []);
  return <RouterProvider router={router} />;
}
