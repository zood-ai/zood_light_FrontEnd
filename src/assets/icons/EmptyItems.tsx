import { PropsIcon } from '@/types/global.type'
import * as React from 'react'
const EmptyItems: React.FC<PropsIcon> = ({ color = 'var(--gray)', className = '', onClick }) => {
  return (
    <svg
      width='40'
      height='40'
      viewBox='0 0 40 40'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
      onClick={onClick}
    >
      <path
        d='M24.168 3.33203H10.0013C9.11725 3.33203 8.2694 3.68322 7.64428 4.30834C7.01916 4.93346 6.66797 5.78131 6.66797 6.66536V33.332C6.66797 34.2161 7.01916 35.0639 7.64428 35.6891C8.2694 36.3142 9.11725 36.6654 10.0013 36.6654H30.0013C30.8854 36.6654 31.7332 36.3142 32.3583 35.6891C32.9834 35.0639 33.3346 34.2161 33.3346 33.332V12.4987L24.168 3.33203Z'
        stroke={color}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M23.332 3.33203V13.332H33.332'
        stroke={color}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M13.332 21.668H16.6654'
        stroke={color}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M13.332 28.332H16.6654'
        stroke={color}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M23.332 21.668H26.6654'
        stroke={color}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M23.332 28.332H26.6654'
        stroke={color}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

const EmptyItemsIcon = React.memo(EmptyItems)
export default EmptyItemsIcon
