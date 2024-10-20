import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from '@/components/ui/dialog'
import { z } from 'zod'
import { ViewModal } from '@/components/custom/ViewModal'

interface SellerDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  initialData?: any
}

export const DetailsModal: React.FC<SellerDetailsModalProps> = ({
  isOpen,
  onClose,
  initialData = {},
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-[80vw] bg-transparent border-none border     '>
  
  <div className=''>
    <div className=''>
    <ViewModal/>
    </div>
  </div>
</DialogContent>
    </Dialog>
  )
}
