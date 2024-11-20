import React, { useState, useEffect } from 'react'
import logo from '/images/SH_LOGO.svg'
import { HomeIcon, PlusIcon } from '@radix-ui/react-icons'
import { IconSearch, IconUserCircle } from '@tabler/icons-react'
function BottomNavBar() {
  const [state, setState] = useState('')

  useEffect(() => {
    return () => {}
  }, [])

  return (
    <>
      <div className='fixed border border-2 bottom-0 left-0 left-1/2 mx-auto inline-flex w-[100vw] -translate-x-1/2 transform justify-between rounded-3xl rounded-b-none bg-background z-10'>
        <a
          aria-current='page'
          className='inline-flex flex-grow flex-col items-center px-4 py-3 text-xs font-medium text-white'
          href='#'
        >
          <HomeIcon className='h-7 w-7 text-[#363088]' />
          <span className='sr-only'>Home</span>
        </a>
        <a
          className='inline-flex flex-grow flex-col items-center px-4 py-3 text-xs font-medium text-blue-400'
          href='#'
        >
          <PlusIcon className='h-7 w-7 text-[#363088]' />
        </a>
        <span className='sr-only'>Upload</span>
        <button className='relative inline-flex flex-grow flex-col items-center px-6 py-3 text-xs font-medium text-white'>
          <div className='absolute bottom-5 rounded-full border-4 border-[#363088] bg-background p-3'>
            <img src={logo || ''} alt='logo' className='h-7 w-7 object-contain' loading='lazy' />
          </div>
          <span className='sr-only'>Chat</span>
        </button>
        <a
          className='inline-flex flex-grow flex-col items-center px-4 py-3 text-xs font-medium text-blue-400'
          href='#'
        >
          <IconSearch className='h-7 w-7 text-[#363088]' />
          <span className='sr-only'>Search</span>
        </a>
        <a
          className='inline-flex flex-grow flex-col items-center px-4 py-3 text-xs font-medium text-blue-400'
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
