import { MixInterfaces, Sale } from '@/types/typings'
import { Button } from 'primereact/button'
import React from 'react'
// import { cancelSaleItem } from '../../components/Datatable/functions'
// import { statusHandler } from '@/app/sale/SaleActions/functions'
import SaleActions from '.'

type Props = {
    selection: Array<Sale & { _id: string }> | [], emptySelection: Function,
    startTransition: React.TransitionStartFunction
}
const BulkUpdate = ({ selection, emptySelection, startTransition }: Props) => {
    return (
        <span className="p-buttonset">
            <SaleActions selection={selection} emptySelection={emptySelection} startTransition={startTransition}  />
            <Button icon="pi pi-times" severity='danger' size='small'
                tooltip='Clear Selection' tooltipOptions={{ position: "bottom" }}
                onClick={() => emptySelection([])}
            />
        </span>
    )
}

export default BulkUpdate