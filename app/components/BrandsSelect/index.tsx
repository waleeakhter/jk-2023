import React from 'react'
import brands from "@/app/utils/brands.json"
import AdvanceSelect from '../AdvanceSelect'
import { Select } from 'antd'
interface Props {
    callback: (value: string[] | string) => void,
    value: string | string[]
}

const BrandsSelect = ({ callback, value }: Props) => {
    return (
        <>
            <Select
                mode="multiple"
                placeholder="Filter by client"
                value={value}
                onChange={(values) => callback(values)}
                options={brands.map((value, index) => ({ label: value.toUpperCase(), value: value }))}
                optionFilterProp="children"
                filterOption={(input, option) =>
                    (option?.label?.toLocaleLowerCase() ?? '').includes(input.toLocaleLowerCase())}
                size='large'
            />
        </>
    )
}

export default BrandsSelect
