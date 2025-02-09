import { PropsIcon } from '@/types/global.type'
import * as React from 'react'
const Car: React.FC<PropsIcon> = ({ color = '#16B6A0', className = '', onClick }) => {
  return (
    <svg
      //   xmlns:xlink="http://www.w3.org/1999/xlink"
      width='16'
      height='12'
      viewBox='0 0 16 12'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      onClick={onClick}
      className={`${className}`}
    >
      <path
        d='M8.75 9V1.5C8.75 1.08579 8.41421 0.75 8 0.75H2C1.58579 0.75 1.25 1.08579 1.25 1.5V9C1.25 9.41421 1.58579 9.75 2 9.75H2.75M8.75 9C8.75 9.41421 8.41422 9.75 8 9.75H5.75M8.75 9L8.75 3C8.75 2.58579 9.08579 2.25 9.5 2.25H11.4393C11.6383 2.25 11.829 2.32902 11.9697 2.46967L14.5303 5.03033C14.671 5.17098 14.75 5.36175 14.75 5.56066V9C14.75 9.41421 14.4142 9.75 14 9.75H13.25M8.75 9C8.75 9.41421 9.08579 9.75 9.5 9.75H10.25M2.75 9.75C2.75 10.5784 3.42157 11.25 4.25 11.25C5.07843 11.25 5.75 10.5784 5.75 9.75M2.75 9.75C2.75 8.92157 3.42157 8.25 4.25 8.25C5.07843 8.25 5.75 8.92157 5.75 9.75M10.25 9.75C10.25 10.5784 10.9216 11.25 11.75 11.25C12.5784 11.25 13.25 10.5784 13.25 9.75M10.25 9.75C10.25 8.92157 10.9216 8.25 11.75 8.25C12.5784 8.25 13.25 8.92157 13.25 9.75'
        stroke={color}
        strokeWidth='1.5px'
        fill='none'
      ></path>
    </svg>
  )
}

const CarIcon = React.memo(Car)
export default CarIcon
