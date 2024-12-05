import PenIcon from '@/assets/icons/Pen'
import React, { useState } from 'react'
import OpeningHourModal from './OpeningHourModal'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { getDay } from '@/utils/function'

const OpeningHour = () => {
    const { watch, control } = useFormContext()


    const [isOpen, setIsOpen] = useState(false)
    const [modalName, setModalName] = useState("")


    return (
        <div className='px-3'>
            <div className='flex items-center justify-between  font-bold'>

                <h1>Opening hours</h1>
                <PenIcon color='#9ca3af' className='cursor-pointer'
                    onClick={() => {
                        setIsOpen(true)
                    }
                    }
                />
            </div>


            {watch("opening_hours")?.map((item, index) => (
                <div className='grid grid-cols-2 pt-5' key={index}>
                    <p>{getDay(item.day)}</p>
                    <p className='text-right'>{item.from}-{item.to}</p>
                </div>
            ))}

            <OpeningHourModal
                openCloseModal={isOpen}
                setOpenCloseModal={setIsOpen}
                setModalName={setModalName}
            />
        </div>
    )
}

export default OpeningHour