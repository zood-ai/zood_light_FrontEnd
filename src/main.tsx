import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import store from './store';
import './index.css';
import { ThemeProvider } from './components/theme-provider';
import { AuthProvider } from './context/AuthContext';
import { LoadingProvider } from './context/LoadingContext';
import { Toaster } from './components/ui/toaster';
import './i18n/i18n';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GlobalDialogProvider } from './context/GlobalDialogProvider';
import { Analytics } from '@vercel/analytics/react';
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <GlobalDialogProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <AuthProvider>
              <LoadingProvider>
                <App />
                <Analytics />
              </LoadingProvider>
            </AuthProvider>
            <Toaster />
          </ThemeProvider>
        </QueryClientProvider>
      </GlobalDialogProvider>
    </Provider>
  </StrictMode>
);
