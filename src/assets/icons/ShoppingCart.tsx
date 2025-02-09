import { PropsIcon } from '@/types/global.type'
import * as React from 'react'
const ShoppingCart: React.FC<PropsIcon> = ({ color = 'white', className = '', onClick }) => {
  return (
    <svg
      width='22'
      height='22'
      viewBox='0 0 22 22'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
      onClick={onClick}
    >
      <path
        d='M1 1H2.99601L5.6507 13.4511C5.74808 13.9071 6.00067 14.3148 6.36498 14.6039C6.72929 14.893 7.18254 15.0455 7.64671 15.0351H17.4072C17.8615 15.0343 18.3019 14.878 18.6557 14.5918C19.0096 14.3056 19.2556 13.9068 19.3533 13.4612L21 6.01253H4.06387M7.93613 19.9975C7.93613 20.5512 7.48931 21 6.93812 21C6.38694 21 5.94012 20.5512 5.94012 19.9975C5.94012 19.4438 6.38694 18.995 6.93812 18.995C7.48931 18.995 7.93613 19.4438 7.93613 19.9975ZM18.9142 19.9975C18.9142 20.5512 18.4674 21 17.9162 21C17.365 21 16.9182 20.5512 16.9182 19.9975C16.9182 19.4438 17.365 18.995 17.9162 18.995C18.4674 18.995 18.9142 19.4438 18.9142 19.9975Z'
        stroke={color}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

const ShoppingCartIcon = React.memo(ShoppingCart)
export default ShoppingCartIcon
