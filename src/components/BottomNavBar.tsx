import React from 'react'
import logo from '/images/SH_LOGO.svg'
import { Home, Plus } from 'lucide-react'
import { IconSearch, IconUserCircle } from '@tabler/icons-react'
function BottomNavBar() {
  return (
    <>
      <div className='fixed bottom-0 left-0 left-1/2 z-10 mx-auto inline-flex w-[100vw] -translate-x-1/2 transform justify-between border-t bg-background/95 backdrop-blur'>
        <a
          aria-current='page'
          className='inline-flex flex-grow flex-col items-center px-4 py-3 text-xs font-medium text-main'
          href='#'
        >
          <Home className='h-7 w-7 text-[#363088]' />
          <span className='sr-only'>Home</span>
        </a>
        <a
          className='inline-flex flex-grow flex-col items-center px-4 py-3 text-xs font-medium text-mainText/70'
          href='#'
        >
          <Plus className='h-7 w-7 text-[#363088]' />
        </a>
        <span className='sr-only'>Upload</span>
        <button className='relative inline-flex flex-grow flex-col items-center px-6 py-3 text-xs font-medium text-main'>
          <div className='absolute bottom-5 rounded-full border-2 border-main/60 bg-background p-3 shadow-sm'>
            <img src={logo || ''} alt='logo' className='h-7 w-7 object-contain' loading='lazy' />
          </div>
          <span className='sr-only'>Chat</span>
        </button>
        <a
          className='inline-flex flex-grow flex-col items-center px-4 py-3 text-xs font-medium text-mainText/70'
          href='#'
        >
          <IconSearch className='h-7 w-7 text-[#363088]' />
          <span className='sr-only'>Search</span>
        </a>
        <a
          className='inline-flex flex-grow flex-col items-center px-4 py-3 text-xs font-medium text-mainText/70'
          href='#'
        >
          <IconUserCircle className='h-7 w-7 text-[#363088]'  />
          <span className='sr-only'>Profile</span>
        </a>
      </div>{' '}
    </>
  )
}

export default BottomNavBar
