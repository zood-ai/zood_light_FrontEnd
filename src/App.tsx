import { useEffect } from 'react';
import './index.css';
import { ThemeProvider } from './components/theme-provider';
import { AuthProvider } from './context/AuthContext';
import { LoadingProvider } from './context/LoadingContext';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import './i18n/i18n';
import router from '@/router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import store from './store';
import { Provider } from 'react-redux';
import { GlobalDialogProvider } from './context/GlobalDialogProvider';
import { Analytics } from '@vercel/analytics/react';
const queryClient = new QueryClient();

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
  return (
    <Provider store={store}>
      <GlobalDialogProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <AuthProvider>
              <LoadingProvider>
                <RouterProvider router={router} />
                <Analytics />
              </LoadingProvider>
            </AuthProvider>
            <Toaster />
          </ThemeProvider>
        </QueryClientProvider>
      </GlobalDialogProvider>
    </Provider>
  );
}
