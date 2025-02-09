import { PropsIcon } from '@/types/global.type'
import * as React from 'react'

const ClearIcon: React.FC<PropsIcon> = ({ color = 'var(--warn)', className = '', onClick }) => {
  return (
    <svg
      width='16'
      height='16'
      viewBox='0 0 18 18'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={`${className} cursor-pointer`}
      onClick={onClick}
    >
      <path d='M17 1L1 17M17 1L1 17' stroke={color} strokeWidth='2' strokeLinecap='round' />
      <path d='M1 1L17 17M1 1L17 17' stroke={color} strokeWidth='2' strokeLinecap='round' />
    </svg>
  )
}

export default ClearIcon
