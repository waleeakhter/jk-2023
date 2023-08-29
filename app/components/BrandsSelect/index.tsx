import React from 'react'
import brands from "@/app/utils/brands.json"
import AdvanceSelect from '../AdvanceSelect'
interface Props {
    callback: (value: any, callback: Function) => void
}

const BrandsSelect = ({ callback }: Props) => {
    return (
        <>
            <AdvanceSelect options={brands} name={'brands'} value={"name"} multiple={true} callback={callback} />
        </>
    )
}

export default BrandsSelect
