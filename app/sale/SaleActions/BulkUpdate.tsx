import { MixInterfaces } from '@/typings'
import { Button } from 'primereact/button'
import React from 'react'
import { cancelSaleItem } from '../../components/Datatable/functions'
import { statusHandler } from '@/app/sale/SaleActions/functions'
import SaleActions from '.'

type Props = { selection: Array<{ _id: string }> | [], emptySelection: Function, }
const BulkUpdate = ({ selection, emptySelection, }: Props) => {
    return (
        <span className="p-buttonset">
            <SaleActions selection={selection} emptySelection={emptySelection} />
            <Button icon="pi pi-times" severity='danger' size='small'
                tooltip='Clear Selection' tooltipOptions={{ position: "bottom" }}
                onClick={() => emptySelection([])}
            />
        </span>
    )
}

export default BulkUpdate