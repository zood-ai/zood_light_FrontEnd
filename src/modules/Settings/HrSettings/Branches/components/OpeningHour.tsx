import PenIcon from '@/assets/icons/Pen'
import React, { useState } from 'react'
import OpeningHourModal from './OpeningHourModal'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { getDay } from '@/utils/function'
import useBranchesHttps from '../queriesHttp/useBranchesHttp'
import useFilterQuery from '@/hooks/useFilterQuery'

const OpeningHour = () => {
    const { setValue } = useFormContext()
    const {filterObj}=useFilterQuery()
    const [isOpen, setIsOpen] = useState(false)
    const [modalName, setModalName] = useState("")

const{BrancheOne}=useBranchesHttps({branchId:filterObj.id})

    return (
        <div className='px-3'>
            <div className='flex items-center justify-between  font-bold'>

                <h1>Opening hours</h1>
                <PenIcon color='#9ca3af' className='cursor-pointer'
                    onClick={() => {
                        setIsOpen(true)
                        setValue("opening_hours",BrancheOne?.opening_hours );
                    }
                    }
                />
            </div>


            {BrancheOne?.opening_hours?.map((item, index) => (
                <>
                <div className='grid grid-cols-2 pt-5' key={index}>
                    <p>{getDay(item.day)}</p>
                    {item?.is_closed? <p className='text-red-500 text-right'>Closed</p>: <p className='text-right'>{item.from}-{item.to}</p>}
                   
                </div>
                </>
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