import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from '@/components/ui/dialog'
import { z } from 'zod'
import { Button } from '@/components/custom/button'
import createCrudService from '@/api/services/crudService'

interface SellerDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  initialData?: any
}

export const ConfirmDelModal: React.FC<SellerDetailsModalProps> = ({
  isOpen,
  onClose,
  initialData = {},
}) => {
  const allServiceUser = createCrudService<any>('ConfirmDelModal')
  const { useGetById, useUpdate, useCreate } = allServiceUser


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-2xl'>
        <div className=''>
          <div className='my-8 text-center'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='inline w-14 fill-red-700'
              viewBox='0 0 24 24'
            >
              <path
                d='M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z'
                data-original='#000000'
              />
              <path
                d='M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z'
                data-original='#000000'
              />
            </svg>
            <h4 className='mt-4 text-lg font-semibold text-gray-800'>
              Are you sure you want to delete it?
            </h4>
            <p className='mt-4 text-sm text-gray-600'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              auctor auctor arcu, at fermentum dui. Maecenas
            </p>
          </div>
          <div className='flex flex-col space-y-2'>
            <Button variant={'destructive'}>
              <span className='ms-1'>Delete</span>
            </Button>

            <Button variant={'outline'} onClick={onClose}>
              <span className='ms-1'>Cancel</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
