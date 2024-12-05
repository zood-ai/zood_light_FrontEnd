import CustomSection from '@/components/ui/custom/CustomSection';
import React from 'react'
import { useFormContext } from "react-hook-form";

const Departments = () => {
    const {watch}=useFormContext()
  
    
    return (
       <div className="mx-3">
        <p className='text-[14x] font-bold pt-3'>Departments</p>
      {watch('departments')?.map((department: any) => (
        <div key={department.id} className="flex items-center gap-3 border-b-2 border-border py-4">
          <p>{department.name}</p>
       </div>
      ))}
       </div>
    )
}

export default Departments