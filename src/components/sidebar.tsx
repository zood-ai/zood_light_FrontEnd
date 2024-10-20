import { useEffect, useState } from 'react';
import { IconChevronsLeft, IconMenu2, IconX } from '@tabler/icons-react';
import { Layout } from './custom/layout';
import { Button } from './custom/button';
import Nav from './nav';
import logo from '/images/SH_LOGO.webp';
import { cn } from '@/lib/utils';
import { sidelinks } from '@/data/sidelinks';

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
  const [isRtl, setIsRtl] = useState(false);
  useEffect(() => {
    setIsRtl(direction === 'rtl');
  }, [direction]);

  return (
    <aside
      className={cn(
        `fixed max-w-[227apx] z-[10000] ${
          isRtl ? 'right-0' : 'left-0'
        } top-0 z-50 w-full border-r-2 border-r-muted transition-[width] md:bottom-0 md:h-svh ${
          isCollapsed ? 'md:w-14' : 'md:w-64'
        } ${isRtl ? 'border-l-2 border-r-0' : ''}`, // Adjust for RTL
        className
      )}
      style={{ direction }} // Apply the direction (ltr or rtl)
    >
      {/* Overlay in mobile */}
      <div
        onClick={() => setNavOpened(false)}
        className={`absolute inset-0 transition-[opacity] delay-100 duration-700 ${
          navOpened ? 'h-svh opacity-50' : 'h-0 opacity-0'
        } w-full bg-black md:hidden`}
      />

      <Layout fixed className={navOpened ? 'h-svh ' : ''}>
        {/* Header */}
        <Layout.Header
          sticky
          className="z-50  flex justify-between px-4 py-3 shadow-0 md:px-4 bg-background  "
        >
          <div className={`flex items-center ${!isCollapsed ? 'gap-2' : ''}`}>
            <img src={logo || ''} alt="" width={isCollapsed ? 24 : 32} />
            <div
              className={`flex flex-col justify-end truncate ${
                isCollapsed ? 'invisible w-0' : 'visible w-auto'
              }`}
            >
              <span className="font-medium">Zood Lite</span>
              <span className="text-xs">E-invoice</span>
            </div>
          </div>

          {/* Toggle Button in mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Toggle Navigation"
            aria-controls="sidebar-menu"
            aria-expanded={navOpened}
            onClick={() => setNavOpened((prev) => !prev)}
          >
            {navOpened ? <IconX /> : <IconMenu2 />}
          </Button>
        </Layout.Header>

        {/* Navigation links */}
        <Nav
          id="sidebar-menu"
          className={`z-40 h-full flex-1  mt-[42px] ${
            navOpened ? 'max-h-screen' : 'max-h-0 py-0 md:max-h-screen md:py-2'
          }`}
          closeNav={() => setNavOpened(false)}
          isCollapsed={isCollapsed}
          links={sidelinks}
        />

        {/* Scrollbar width toggle button */}
        <Button
          onClick={() => setIsCollapsed((prev) => !prev)}
          size="icon"
          variant="outline"
          className={`absolute
             ${
            isRtl ? '-left-5' : '-right-5'

          } 
          top-1/2 z-50 hidden rounded-full md:inline-flex`}
        >
          <IconChevronsLeft
            stroke={1.5}
            className={`h-5 w-5 ${isRtl && !isCollapsed ? 'rotate-180' : ''} ${
              !isRtl && !!isCollapsed ? 'rotate-180' : ''
            }`} // Adjust rotation for RTL
          />
        </Button>
      </Layout>
    </aside>
  );
}
