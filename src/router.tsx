import { createBrowserRouter } from 'react-router-dom';
import GeneralError from './pages/errors/general-error';
import NotFoundError from './pages/errors/not-found-error';
import MaintenanceError from './pages/errors/maintenance-error';
import UnauthorisedError from './pages/errors/unauthorised-error.tsx';
import React from 'react';
import ProtectedRoute from './config/ProtectedRoute.tsx';
import { Roles } from './config/roles.ts';
import DashCards from './components/DashCards.tsx';
import { DashBoard } from './pages/DashBoard/DashBoard.tsx';
import { IndividualInvoices } from './pages/IndividualInvoices/IndividualInvoices.tsx';
import { IndividualInvoicesAdd } from './pages/IndividualInvoices/IndividualInvoicesAdd/IndividualInvoicesAdd.tsx';
import { CorporateInvoices } from './pages/CorporateInvoices/CorporateInvoices.tsx';
import { CorporateInvoicesAdd } from './pages/CorporateInvoices/CorporateInvoicesAdd/CorporateInvoicesAdd.tsx';
import { PurchaseInvoices } from './pages/PurchaseInvoices/PurchaseInvoices.tsx';
import { PurchaseInvoicesAdd } from './pages/PurchaseInvoices/PurchaseInvoicesAdd/PurchaseInvoicesAdd.tsx';
import { PriceQuoteAdd } from './pages/PriceQuote/PriceQuoteAdd/PriceQuoteAdd.tsx';
import { PriceQuote } from './pages/PriceQuote/PriceQuote.tsx';
import { Products } from './pages/Products/Products.tsx';
import { Categories } from './pages/Categories/Categories.tsx';
import { Customers } from './pages/Customers/Customers.tsx';
import { Resources } from './pages/Resources/Resources.tsx';
import { ResourcesAdd } from './pages/Resources/ResourcesAdd/ResourcesAdd.tsx';
import { CustomersAdd } from './pages/Customers/CustomersAdd/CustomersAdd.tsx';
import { CategoriesAdd } from './pages/Categories/CategoriesAdd/CategoriesAdd.tsx';
import { ProductsAdd } from './pages/Products/ProductsAdd/ProductsAdd.tsx';
import { RegisterForm } from './components/custom/RegisterForm/RegisterForm.tsx';
import { LoginForm } from './components/custom/LoginForm/LoginForm.tsx';
import { ShopCard } from './pages/IndividualInvoices/ShopCard/ShopCard.tsx';
import { ShopCardCo } from './pages/CorporateInvoices/ShopCard/ShopCard.tsx';
import { ShopCardPrice } from './pages/PriceQuote/ShopCard/ShopCard.tsx';
import SignIn2 from './pages/auth/sign-in-2.tsx';

const SignIn = React.lazy(() => import('./pages/auth/sign-in'));
const AppShell = React.lazy(() => import('./components/app-shell'));
const Tasks = React.lazy(() => import('./pages/tasks/index.tsx'));

const ComingSoon = React.lazy(() => import('@/components/coming-soon'));

const Settings = React.lazy(() => import('./pages/settings'));
const Profile = React.lazy(() => import('./pages/settings/profile'));
const Account = React.lazy(() => import('./pages/settings/account'));
const Appearance = React.lazy(() => import('./pages/settings/appearance'));
const Notifications = React.lazy(
  () => import('./pages/settings/notifications')
);
const Display = React.lazy(() => import('./pages/settings/display'));
const ErrorExample = React.lazy(() => import('./pages/settings/error-example'));

const router = createBrowserRouter([
  // Auth routes
  {
    path: '/login',
    lazy: async () => ({
      Component: (await import('./pages/auth/sign-in')).default,
    }),
  },
  // {
  //   path: '/sign-in-2',
  //   lazy: async () => ({
  //     Component: (await import('./pages/auth/sign-in-2')).default,
  //   }),
  // },
  {
    path: '/sign-up',
    lazy: async () => ({
      Component: (await import('./pages/auth/sign-up')).default,
    }),
  },
  {
    path: '/forgot-password',
    lazy: async () => ({
      Component: (await import('./pages/auth/forgot-password')).default,
    }),
  },
  {
    path: '/otp',
    lazy: async () => ({
      Component: (await import('./pages/auth/otp')).default,
    }),
  },
  {
    path: '/otp',
    lazy: async () => ({
      Component: (await import('./pages/auth/otp')).default,
    }),
  },
  {
    path: '/',
    element: (
      <React.Suspense fallback={<div>Loading register...</div>}>
        <RegisterForm />
      </React.Suspense>
    ),
  },
  {
    path: 'zood-login',
    element: (
      <React.Suspense fallback={<div>Loading register...</div>}>
        <SignIn2 />
      </React.Suspense>
    ),
  },
  // Main routes
  {
    path: '/zood-dashboard',
    element: (
      <ProtectedRoute requiredRole={Roles.ADMIN}>
        <AppShell />
      </ProtectedRoute>
    ),
    errorElement: <GeneralError />,
    children: [
      {
        index: true,
        element: (
          <React.Suspense fallback={<div>Loading Dashboard...</div>}>
            <ProtectedRoute requiredRole={Roles.ADMIN}>
              <DashBoard />
            </ProtectedRoute>
          </React.Suspense>
        ),
      },

      {
        path: 'individual-invoices',
        element: (
          <React.Suspense fallback={<div>Loading Individual Invoices...</div>}>
            <ProtectedRoute requiredRole={Roles.ADMIN}>
              <IndividualInvoices />
            </ProtectedRoute>
          </React.Suspense>
        ),
      },
      {
        path: 'individual-invoices/add',
        element: (
          <React.Suspense fallback={<div>Loading Individual Invoices...</div>}>
            <ProtectedRoute requiredRole={Roles.ADMIN}>
              <IndividualInvoicesAdd />
            </ProtectedRoute>
          </React.Suspense>
        ),
      },
      {
        path: 'individual-invoices/add/shop-card',
        element: (
          <React.Suspense fallback={<div>Loading Individual Invoices...</div>}>
            <ProtectedRoute requiredRole={Roles.ADMIN}>
              <ShopCard />
            </ProtectedRoute>
          </React.Suspense>
        ),
      },
      {
        path: 'corporate-invoices',
        element: (
          <React.Suspense fallback={<div>Loading Corporate Invoices...</div>}>
            <ProtectedRoute requiredRole={Roles.ADMIN}>
              <CorporateInvoices />
            </ProtectedRoute>
          </React.Suspense>
        ),
      },
      {
        path: 'corporate-invoices/add',
        element: (
          <React.Suspense fallback={<div>Loading Corporate Invoices...</div>}>
            <ProtectedRoute requiredRole={Roles.ADMIN}>
              <CorporateInvoicesAdd />
            </ProtectedRoute>
          </React.Suspense>
        ),
      },
      {
        path: 'corporate-invoices/add/shop-card',
        element: (
          <React.Suspense fallback={<div>Loading Individual Invoices...</div>}>
            <ProtectedRoute requiredRole={Roles.ADMIN}>
              <ShopCardCo />
            </ProtectedRoute>
          </React.Suspense>
        ),
      },
      {
        path: 'purchase-invoices',
        element: (
          <React.Suspense fallback={<div>Loading Purchase Invoices...</div>}>
            <ProtectedRoute requiredRole={Roles.ADMIN}>
              <PurchaseInvoices />
            </ProtectedRoute>
          </React.Suspense>
        ),
      },
      {
        path: 'purchase-invoices/add',
        element: (
          <React.Suspense fallback={<div>Loading Purchase Invoices...</div>}>
            <ProtectedRoute requiredRole={Roles.ADMIN}>
              <PurchaseInvoicesAdd />
            </ProtectedRoute>
          </React.Suspense>
        ),
      },
      {
        path: 'price-quote',
        element: (
          <React.Suspense fallback={<div>Loading Price Quote...</div>}>
            <ProtectedRoute requiredRole={Roles.ADMIN}>
              <PriceQuote />
            </ProtectedRoute>
          </React.Suspense>
        ),
      },
      {
        path: 'price-quote/add',
        element: (
          <React.Suspense fallback={<div>Loading Price Quote...</div>}>
            <ProtectedRoute requiredRole={Roles.ADMIN}>
              <PriceQuoteAdd />
            </ProtectedRoute>
          </React.Suspense>
        ),
      },
      {
        path: 'price-quote/add/shop-card',
        element: (
          <React.Suspense fallback={<div>Loading Price Quote...</div>}>
            <ProtectedRoute requiredRole={Roles.ADMIN}>
              <ShopCardPrice />
            </ProtectedRoute>
          </React.Suspense>
        ),
      },
      {
        path: 'products',
        element: (
          <React.Suspense fallback={<div>Loading Products...</div>}>
            <ProtectedRoute requiredRole={Roles.ADMIN}>
              <Products />
            </ProtectedRoute>
          </React.Suspense>
        ),
      },
      {
        path: 'products/add',
        element: (
          <React.Suspense fallback={<div>Loading Products...</div>}>
            <ProtectedRoute requiredRole={Roles.ADMIN}>
              <ProductsAdd />
            </ProtectedRoute>
          </React.Suspense>
        ),
      },
      {
        path: 'categories',
        element: (
          <React.Suspense fallback={<div>Loading Categories...</div>}>
            <ProtectedRoute requiredRole={Roles.ADMIN}>
              <Categories />
            </ProtectedRoute>
          </React.Suspense>
        ),
      },
      {
        path: 'categories/add',
        element: (
          <React.Suspense fallback={<div>Loading Categories...</div>}>
            <ProtectedRoute requiredRole={Roles.ADMIN}>
              <CategoriesAdd />
            </ProtectedRoute>
          </React.Suspense>
        ),
      },
      {
        path: 'customers',
        element: (
          <React.Suspense fallback={<div>Loading Customers...</div>}>
            <ProtectedRoute requiredRole={Roles.ADMIN}>
              <Customers />
            </ProtectedRoute>
          </React.Suspense>
        ),
      },
      {
        path: 'customers/add',
        element: (
          <React.Suspense fallback={<div>Loading Customers...</div>}>
            <ProtectedRoute requiredRole={Roles.ADMIN}>
              <CustomersAdd />
            </ProtectedRoute>
          </React.Suspense>
        ),
      },
      {
        path: 'resources',
        element: (
          <React.Suspense fallback={<div>Loading Resources...</div>}>
            <ProtectedRoute requiredRole={Roles.ADMIN}>
              <Resources />
            </ProtectedRoute>
          </React.Suspense>
        ),
      },
      {
        path: 'resources/add',
        element: (
          <React.Suspense fallback={<div>Loading Resources...</div>}>
            <ProtectedRoute requiredRole={Roles.ADMIN}>
              <ResourcesAdd />
            </ProtectedRoute>
          </React.Suspense>
        ),
      },
      {
        path: 'reports',
        element: (
          <React.Suspense fallback={<div>Loading Reports...</div>}>
            <ProtectedRoute requiredRole={Roles.ADMIN}>
              <ComingSoon />
            </ProtectedRoute>
          </React.Suspense>
        ),
        children: [
          {
            path: 'normal-invoice',
            element: (
              <React.Suspense fallback={<div>Loading My Plan...</div>}>
                <ProtectedRoute requiredRole={Roles.ADMIN}>
                  <ComingSoon />
                </ProtectedRoute>
              </React.Suspense>
            ),
          },
          {
            path: 'b2b-invoices',
            element: (
              <React.Suspense fallback={<div>Loading My Plan...</div>}>
                <ProtectedRoute requiredRole={Roles.ADMIN}>
                  <ComingSoon />
                </ProtectedRoute>
              </React.Suspense>
            ),
          },
          {
            path: 'purchase-invoices',
            element: (
              <React.Suspense fallback={<div>Loading My Plan...</div>}>
                <ProtectedRoute requiredRole={Roles.ADMIN}>
                  <ComingSoon />
                </ProtectedRoute>
              </React.Suspense>
            ),
          },
        ],
      },
      {
        path: 'my-plan',
        element: (
          <React.Suspense fallback={<div>Loading Payment Methods...</div>}>
            <ProtectedRoute requiredRole={Roles.ADMIN}>
              <ComingSoon />
            </ProtectedRoute>
          </React.Suspense>
        ),
      },
      {
        path: 'payment-methods',
        element: (
          <React.Suspense fallback={<div>Loading Payment Methods...</div>}>
            <ProtectedRoute requiredRole={Roles.ADMIN}>
              <ComingSoon />
            </ProtectedRoute>
          </React.Suspense>
        ),
      },
      {
        path: 'settings',
        element: (
          <React.Suspense fallback={<div>Loading Settings...</div>}>
            <ProtectedRoute requiredRole={Roles.ADMIN}>
              <Settings />
            </ProtectedRoute>
          </React.Suspense>
        ),
        errorElement: <GeneralError />,
        children: [
          {
            index: true,
            element: (
              <React.Suspense fallback={<div>Loading Profile...</div>}>
                <Profile />
              </React.Suspense>
            ),
          },
          {
            path: 'account',
            element: (
              <React.Suspense fallback={<div>Loading Account...</div>}>
                <Account />
              </React.Suspense>
            ),
          },
          {
            path: 'appearance',
            element: (
              <React.Suspense fallback={<div>Loading Appearance...</div>}>
                <Appearance />
              </React.Suspense>
            ),
          },
          {
            path: 'notifications',
            element: (
              <React.Suspense fallback={<div>Loading Notifications...</div>}>
                <Notifications />
              </React.Suspense>
            ),
          },
          {
            path: 'display',
            element: (
              <React.Suspense fallback={<div>Loading Display...</div>}>
                <Display />
              </React.Suspense>
            ),
          },
          {
            path: 'error-example',
            element: (
              <React.Suspense fallback={<div>Loading Error Example...</div>}>
                <ErrorExample />
              </React.Suspense>
            ),
            errorElement: <GeneralError className="h-[50svh]" minimal />,
          },
        ],
      },
      {
        path: 'contact-whatsapp',
        element: (
          <React.Suspense fallback={<div>Loading WhatsApp Contact...</div>}>
            <ProtectedRoute requiredRole={Roles.ADMIN}>
              <ComingSoon />
            </ProtectedRoute>
          </React.Suspense>
        ),
      },
      {
        path: 'logout',
        element: <ComingSoon />,
      },
    ],
  },

  // Error routes
  { path: '/500', Component: GeneralError },
  { path: '/404', Component: NotFoundError },
  { path: '/503', Component: MaintenanceError },
  { path: '/401', Component: UnauthorisedError },

  // Fallback 404 route
  { path: '*', Component: NotFoundError },
]);

export default router;
