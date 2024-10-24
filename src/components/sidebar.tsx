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
        `fixed w-[227px] z-[10000]  ${
          isRtl ? 'right-0' : 'left-0'
        } top-0 z-50 w-[227px] border-r-2 border-r-muted transition-[width] md:bottom-0 md:h-svh ${
          isCollapsed ? 'md:w-14' : 'md:w-64'
        } ${isRtl ? 'border-l-2 border-r-0' : ''}`, // Adjust for RTL
        className
      )}
      style={{ direction }} // Apply the direction (ltr or rtl)
    >
      {/* Overlay in mobile */}
      {/* <div
        onClick={() => setNavOpened(false)}
        className={`absolute inset-0 transition-[opacity] delay-100 duration-700 ${
          navOpened ? 'h-svh opacity-50' : 'h-0 opacity-0'
        } w-[227px] bg-black md:hidden`}
      /> */}

      <Layout
        fixed
        className={
          navOpened
            ? 'h-svh  transition-all ease-out duration-500'
            : 'transition-all ease-out duration-500'
        }
      >
        {/* Header */}
        <Layout.Header
          sticky
          className="z-50  flex justify-between px-4 py-3 shadow-0 md:px-4 bg-background  transition-all ease-out duration-500 "
        >
          <div
            className={`flex  items-center mt-[40px]  transition-all ease-out duration-500 ${
              !isCollapsed ? 'gap-2' : ''
            }`}
          >
            <img
              src={logo || ''}
              alt=""
              width={isCollapsed ? 24 : 32}
              className={`${
                isCollapsed
                  ? 'absolute top-[79px] right-[16px] z-[999999] transition-all ease-out duration-500'
                  : 'absolute top-[32px] right-[20px] z-[999999] transition-all ease-out duration-500'
              }`}
            />
            <div
              className={`flex flex-col justify-end truncate ${
                isCollapsed ? 'invisible w-0' : 'visible w-auto'
              }`}
            >
              {/* <span className="font-medium">Zood Lite</span>
              <span className="text-xs">E-invoice</span> */}
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
          className={`z-40 h-full flex-1 overflow-x-hidden mt-[42px] transition-all ease-out duration-500 ${
            navOpened ? 'max-h-screen' : 'max-h-0 py-0 md:max-h-screen md:py-2'
          }`}
          closeNav={() => setNavOpened(false)}
          isCollapsed={isCollapsed}
          links={sidelinks}
        />

        {/* Scrollbar width toggle button */}
        <div
          onClick={() => setIsCollapsed((prev) => !prev)}
          // size="icon"
          // variant="outline"
          className={`absolute cursor-pointer hover:scale-105
             ${isRtl ? 'left-[14px]' : '-right-5'} 
          top-[40px] z-50 hidden rounded-ful bg-white border-0 l md:inline-flex`}
          // top-1/2 z-50 hidden rounded-full md:inline-flex`}
        >
          <svg
            width="24"
            height="18"
            viewBox="0 0 24 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_457_2141)">
              <path
                d="M22.4987 3.00015H1.49839C0.669939 3.00015 -0.00146484 2.3283 -0.00146484 1.49985C-0.00146484 0.6714 0.669939 0 1.49839 0H22.4987C23.3271 0 23.9985 0.6714 23.9985 1.49985C23.9985 2.3283 23.3271 2.9997 22.4987 2.9997V3.00015Z"
                fill="#868686"
              />
              <path
                d="M22.4987 17.9999H1.49839C0.669939 17.9999 -0.00146484 17.3285 -0.00146484 16.5001C-0.00146484 15.6716 0.669939 15.0002 1.49839 15.0002H22.4987C23.3271 15.0002 23.9985 15.6716 23.9985 16.5001C23.9985 17.3285 23.3271 17.9999 22.4987 17.9999Z"
                fill="#868686"
              />
              <path
                d="M22.4987 10.4998H1.49839C0.669939 10.4998 -0.00146484 9.82842 -0.00146484 8.99997C-0.00146484 8.17152 0.669939 7.50012 1.49839 7.50012H22.4987C23.3271 7.50012 23.9985 8.17152 23.9985 8.99997C23.9985 9.82842 23.3271 10.4998 22.4987 10.4998Z"
                fill="#868686"
              />
            </g>
            <defs>
              <clipPath id="clip0_457_2141">
                <rect
                  width="24"
                  height="18"
                  fill="white"
                  transform="translate(-0.00146484)"
                />
              </clipPath>
            </defs>
          </svg>
        </div>
      </Layout>
    </aside>
  );
}
