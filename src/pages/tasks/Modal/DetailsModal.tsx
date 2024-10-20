import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from '@/components/ui/dialog'
import { z } from 'zod'

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
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Details Data Modal</DialogTitle>
          <DialogDescription>All the details Data below.</DialogDescription>
        </DialogHeader>
        <div className=''>
          <div className='grid grid-cols-1 px-4 py-5 sm:p-6 md:grid-cols-2'>
            <div className='mb-6 flex flex-col'>
              <span className=' text-lg font-medium'>Cardholder Name</span>
              <span className='text-lg font-medium text-muted-foreground'>
                {initialData?.label}
              </span>
            </div>
            <div className='mb-6 flex flex-col'>
              <span className='text-lg font-medium'>Card Number</span>
              <span className='text-lg font-medium text-muted-foreground'>
                {initialData?.priority}
              </span>
            </div>
            <div className='mb-6 flex flex-col'>
              <span className=' text-lg font-medium'>Cardholder Name</span>

              <span className='text-lg font-medium text-muted-foreground '>
                {initialData?.status}
              </span>
            </div>
            <div className='mb-6 flex flex-col'>
              <span className=' text-lg font-medium'>Cardholder Name</span>
              <span className='a text-lg font-medium text-muted-foreground '>
                {initialData?.title}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
