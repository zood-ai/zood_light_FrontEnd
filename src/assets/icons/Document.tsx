import { PropsIcon } from '@/types/global.type'
import { memo } from 'react'

const Document: React.FC<PropsIcon> = ({ color = 'var(--secondary-foreground)' }) => {
  return (
    <svg width='14' height='17' viewBox='0 0 14 17' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M8.5 1V5.5H13M4 9.25H5.5M4 12.25H5.5M8.5 9.25H10M8.5 12.25H10M8.875 1H2.5C2.10218 1 1.72064 1.15804 1.43934 1.43934C1.15804 1.72064 1 2.10218 1 2.5V14.5C1 14.8978 1.15804 15.2794 1.43934 15.5607C1.72064 15.842 2.10218 16 2.5 16H11.5C11.8978 16 12.2794 15.842 12.5607 15.5607C12.842 15.2794 13 14.8978 13 14.5V5.125L8.875 1Z'
        stroke={color}
        strokeWidth='1.2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

const DocumentIcon = memo(Document)
export default DocumentIcon
