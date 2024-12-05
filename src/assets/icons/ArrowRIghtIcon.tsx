import { PropsIcon } from '@/types/global.type'
import * as React from 'react'
const ArrowRightIcon: React.FC<PropsIcon> = ({ color = 'black', className }) => {
  return (
    <svg
      width='25'
      height='25'
      viewBox='0 0 11 11'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <path
        d='M1 5.66667H10.3333M10.3333 5.66667L5.66667 10.3333M10.3333 5.66667L5.66667 1'
        stroke={color}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

export default ArrowRightIcon
