import { MixInterfaces } from '@/typings'
import { Button } from 'primereact/button'
import React from 'react'
import { cancelSaleItem } from '../../components/Datatable/functions'
import { statusHandler } from '@/app/sale/SaleActions/functions'
import SaleActions from '.'

type Props = { selection: Array<{ _id: string }> | [], emptySelection: Function, }
const BulkUpdate = ({ selection, emptySelection, }: Props) => {


    // const bulkUpdate = (e: React.SyntheticEvent, status: number) => {
    //     console.log(selection);
    //     const ids: string[] = []
    //     selection.map((val) => ids.push(val._id));
    //     statusHandler(ids, status, e).then(res => {
    //         console.log(res, "res")
    //         if (res?.acknowledged) {
    //             emptySelection((prev: Object[]) => prev = [])
    //         }
    //     })
    // }

    // const bulkDelete = ((e: React.SyntheticEvent,) => {
    //     cancelSaleItem(e, selection).then((res: {
    //         message: string, status: Boolean
    //     }) => {
    //         console.log(res, "delete")
    //         if (res.status) {
    //             alert(res.message);
    //             emptySelection((prev: Object[]) => prev = [])
    //         } else {
    //             alert(res.message)
    //         }
    //     })
    // })
    return (
        <span className="p-buttonset">
            <SaleActions selection={selection} emptySelection={emptySelection} />
        </span>
    )
}

export default BulkUpdate