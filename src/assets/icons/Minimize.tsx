import { PropsIcon } from '@/types/global.type'
import * as React from 'react'
const Minimize: React.FC<PropsIcon> = () => {
  return (

    <svg width="20px" height="20px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    
    <title/>
    
    <g id="Complete">
    
    <g id="minimize">
    
    <g>
    
    <path d="M8,3V6A2,2,0,0,1,6,8H3" fill="none" stroke="#d1d4d6" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
    
    <path d="M16,21V18a2,2,0,0,1,2-2h3" fill="none" stroke="#d1d4d6" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
    
    <path d="M8,21V18a2,2,0,0,0-2-2H3" fill="none" stroke="#d1d4d6" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
    
    <path d="M16,3V6a2,2,0,0,0,2,2h3" fill="none" stroke="#d1d4d6" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
    
    </g>
    
    </g>
    
    </g>
    
    </svg>

  )
}

const MinimizeIcon = React.memo(Minimize)
export default MinimizeIcon
