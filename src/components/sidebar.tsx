import { useEffect, useState } from 'react';
import { IconChevronsLeft, IconMenu2, IconX } from '@tabler/icons-react';
import { Layout } from './custom/layout';
import { Button } from './custom/button';
import Nav from './nav';
import logo from '/images/SH_LOGO.svg';
import { cn } from '@/lib/utils';
import { sidelinks } from '@/data/sidelinks';
import { Link } from 'react-router-dom';

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  direction?: 'ltr' | 'rtl'; // Add direction prop to support RTL
}

export default function Sidebar({
  className,
  isCollapsed,
  setIsCollapsed,
  direction = 'ltr', // default to LTR
}: SidebarProps) {
  const [navOpened, setNavOpened] = useState(false);

  /* Make body not scrollable when navBar is opened */
  useEffect(() => {
    if (navOpened) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [navOpened]);
  const isRtl = direction === 'rtl';

  return (
    <>
      <div
        onClick={() => setNavOpened(false)}
        className={cn(
          'fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden',
          navOpened ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
      />
      <aside
        className={cn(
          `fixed ${
            isRtl ? 'right-0' : 'left-0'
          } top-0 z-50 border-r border-r-muted bg-background shadow-sm transition-[width] md:bottom-0 md:h-svh ${
            isCollapsed ? 'md:w-14' : 'md:w-64'
          } ${isRtl ? 'border-l border-r-0' : ''}`,
          className
        )}
        style={{ direction }}
      >

      <Layout
        fixed
        className={
          navOpened
              ? 'h-svh w-[100vw] transition-all duration-300 ease-out md:w-full'
              : 'h-svh w-[100vw] transition-all duration-300 ease-out md:w-full'
        }
      >
        {/* Header */}
        <Layout.Header
          sticky
          style={{ direction }}
          className="z-50 flex h-16 items-center justify-between border-b bg-background px-3 transition-all duration-300 ease-out md:px-3"
        >
          <div
            className={`flex items-center transition-all duration-300 ease-out ${
              !isCollapsed ? 'gap-2' : ''
            }`}
          >
            <Link to="/zood-dashboard">
              <img
                src={logo || ''}
                alt="Zood Logo"
                className={cn(
                  'cursor-pointer object-contain transition-transform hover:scale-105',
                  isCollapsed ? 'h-8 w-8' : 'h-10 w-auto'
                )}
              />
            </Link>
            <div
              className={`flex flex-col justify-end truncate ${
                isCollapsed ? 'invisible w-0' : 'visible w-auto'
              }`}
            >
              <span className="text-sm font-semibold leading-none text-main">
                Zood Lite
              </span>
              <span className="text-xs text-muted-foreground">E-invoice</span>
            </div>
          </div>

          {/* Toggle Button in mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden "
            aria-label="Toggle Navigation"
            aria-controls="sidebar-menu"
            aria-expanded={navOpened}
            onClick={() => {
              setNavOpened((prev) => !prev);
            }}
          >
            {navOpened ? <IconX /> : <IconMenu2 />}
          </Button>
        </Layout.Header>

        {/* Navigation links */}
        <Nav
          id="sidebar-menu"
          className={`z-40 h-full flex-1 overflow-x-hidden transition-all duration-300 ease-out md:mt-2 ${
            navOpened ? 'max-h-screen' : 'max-h-0 py-0 md:max-h-screen md:py-2'
          }`}
          closeNav={() => setNavOpened(false)}
          isCollapsed={isCollapsed}
          links={sidelinks}
        />

        {/* Scrollbar width toggle button */}
        <Button
          onClick={() => setIsCollapsed((prev) => !prev)}
          variant="outline"
          size="icon"
          className={cn(
            'absolute top-20 hidden h-8 w-8 rounded-full border bg-background shadow-sm transition-transform hover:scale-105 md:inline-flex',
            isRtl ? '-left-4' : '-right-4'
          )}
          aria-label="Toggle sidebar width"
        >
          <IconChevronsLeft
            size={16}
            className={cn(
              'transition-transform duration-300',
              isCollapsed ? (isRtl ? 'rotate-0' : 'rotate-180') : isRtl ? 'rotate-180' : 'rotate-0'
            )}
          />
        </Button>
      </Layout>
      </aside>
    </>
  );
}
