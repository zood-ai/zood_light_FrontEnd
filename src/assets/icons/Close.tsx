import { PropsIcon } from '@/types/global.type'
import * as React from 'react'
const Close: React.FC<PropsIcon> = ({ color = 'var(--warn)', className = '', onClick }) => {
  return (
    <svg
      width='14'
      height='14'
      viewBox='0 0 14 14'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={` ${className}`}
      onClick={onClick}
    >
      <path
        d='M12.9996 12.9996L1.60156 1.60156'
        stroke={color}
        strokeWidth='2'
        strokeLinecap='round'
      />
      <path
        d='M1.60003 12.9996L12.998 1.60156'
        stroke={color}
        strokeWidth='2'
        strokeLinecap='round'
      />
    </svg>
  )
}

const CloseIcon = React.memo(Close)
export default CloseIcon
