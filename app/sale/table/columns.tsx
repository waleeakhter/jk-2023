'use client'
import { Tooltip } from 'primereact/tooltip';
export const columns = [
    { field: "client.name", header: 'Client', frozen: true, sortable: true },
    {
        field: (data: { item: { name: string } }) =>
            <p data-pr-tooltip={data.item.name} className="itemName max-w-[20rem] text-ellipsis overflow-hidden whitespace-nowrap ">{data.item.name}</p>,
        header: 'Item', frozen: true
    },
    { field: 'item.type', header: 'Type', sortable: true },
    {
        field: "sell_price", header: 'Price',
        enabledEdit: true, type: "number"

    },
    { field: 'sell_quantity', header: 'Quantity', enabledEdit: true, type: "number" },
    {
        field: (data: { total_amount: number }) =>
            <p>{data.total_amount}<i className='pi pi-euro text-sm '></i></p>, header: 'Total'
    },
    {
        field: "createdAt",
        header: 'created At',
        enabledEdit: true,
        type: "date",
        sortable: true
    },
    // {
    //     field: "paidOn",
    //     header: 'Paid At',
    //     enabledEdit: true,
    //     type: "date"
    // },

]

import React from 'react'
import SaleActions from '../SaleActions';
import { Sale } from '@/typings';

type Props = {}

const Tooltips = (props: Props) => {
    return (
        <Tooltip target=".itemName" position='bottom'></Tooltip>
    )
}

export default Tooltips