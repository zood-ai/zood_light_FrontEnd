import { PropsIcon } from '@/types/global.type'
import * as React from 'react'
const Right: React.FC<PropsIcon> = ({ color = 'var(--text-primary)', className = '', onClick }) => {
  return (
    <svg
      width='14'
      height='11'
      viewBox='0 0 14 11'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={`${className}`}
      onClick={onClick}
    >
      <path
        d='M13 1L4.75 10L1 5.90909'
        stroke={color}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

const RightIcon = React.memo(Right)
export default RightIcon
