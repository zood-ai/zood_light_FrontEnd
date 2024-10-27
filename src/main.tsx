import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
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

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <GlobalDialogProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <AuthProvider>
              <LoadingProvider>
                <RouterProvider router={router} />
              </LoadingProvider>
            </AuthProvider>
            <Toaster />
          </ThemeProvider>
        </QueryClientProvider>
      </GlobalDialogProvider>
    </Provider>
  </StrictMode>
);
