import CustomSection from '@/components/ui/custom/CustomSection';
import React from 'react'

const Positions = () => {
    const [isOpenShift, setIsOpenShift] = React.useState(false);
    const [isEdit, setIsEdit] = React.useState(false);
    const [rowData, setRowData] = React.useState<any>();
    const data = [
        { name: "position1", type: 2 }
    ]
    return (
        <>
            <CustomSection
                className='px-3 pt-3'
                border={false}
                title="Positions"
                description="Add new position"
                setIsOpen={setIsOpenShift}
                Data={data}
                isLoading={false}
                onClick={() => {
                    setIsOpenShift(true);

                }}
                onEdit={(e: any) => {
                    setRowData(e)
                    setIsOpenShift(true);
                    setIsEdit(true);
                }}
            />
        </>
    )
}

export default Positions