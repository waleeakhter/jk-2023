import { MixInterfaces } from '@/typings'
import { Button } from 'primereact/button'
import React from 'react'
import { cancelSaleItem, statusHandler } from './functions'

type Props = { selection: Array<{ _id: string }> | [], emptySelection: Function, paidOn: Date }
const BulkUpdate = ({ selection, emptySelection, paidOn }: Props) => {
    const bulkUpdate = (e: React.SyntheticEvent, status: number) => {
        console.log(selection);
        const ids: string[] = []
        selection.map((val) => ids.push(val._id));
        statusHandler(e, ids, status, paidOn).then(res => {
            console.log(res, "res")
            if (res?.acknowledged) {
                emptySelection((prev: Object[]) => prev = [])
            }
        })
    }

    const bulkDelete = ((e: React.SyntheticEvent,) => {
        cancelSaleItem(e, selection).then((res: {
            message: string, status: Boolean
        }) => {
            console.log(res, "delete")
            if (res.status) {
                alert(res.message);
                emptySelection((prev: Object[]) => prev = [])
            } else {
                alert(res.message)
            }
        })
    })
    return (
        <span className="p-buttonset">
            <Button label="Paid All" size='small' icon="pi pi-check" onClick={(e) => bulkUpdate(e, 1)} />
            <Button label="Credit All" size='small' icon="pi pi-trash" onClick={(e) => bulkUpdate(e, 2)} />
            <Button label="Delete All" size='small' icon="pi pi-trash" onClick={(e) => bulkDelete(e)} />
        </span>
    )
}

export default BulkUpdate