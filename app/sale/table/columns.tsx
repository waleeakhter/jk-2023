import { ColumnEditorOptions, ColumnProps } from 'primereact/column';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Tooltip } from 'primereact/tooltip';
import DatePicker from "react-datepicker";

const inputsEditor = (options: any, type: string) => {

    switch (type) {
        case "number":
            return <InputNumber inputClassName=' max-w-[4rem] w-16 overflow-hidden ' step={1} type="text" mode="decimal" maxFractionDigits={2}
                value={options.value || options.props.children || 0} onChange={(e) => options.editorCallback(e.value)} />;
        case "text":
            return <InputText step={1} type="text"
                value={options.value || " "} onChange={(e) => options.editorCallback(e.target.value)} />;
        case "date":
            return <DatePicker name="createdAt" selected={new Date(options.value)} className=' z-[100] '
                placeholderText="Select a date" maxDate={new Date()} showTimeInput
                onChange={(date) => options.editorCallback(date)} />
        default:
            break;
    }

}
export const columns: Array<ColumnProps> = [
    {
        field: "client.name", header: 'Client', sortable: true,
    },
    {
        body: (data: { item: { name: string } }) => <p data-pr-tooltip={data.item.name} className="itemName max-w-[20rem] text-ellipsis overflow-hidden whitespace-nowrap ">{data.item.name}</p>,
        header: 'Item',
        sortable: true
    },
    {
        field: 'item.type', header: 'Type', sortable: true,

    },
    {
        field: "sell_price", header: 'Price',
        editor: (options: ColumnEditorOptions) => {
            return inputsEditor(options, "number")
        },

    },
    {
        field: 'sell_quantity', header: 'Quantity',
        editor: (options: ColumnEditorOptions) => {
            return inputsEditor(options, "number")
        },
    },
    {
        body: (data: { total_amount: number }) => <p className=" text-sm ">{data.total_amount}€</p>, header: 'Total'
    },
    {
        body: (data: { resource: string }) => <p className=" text-sm ">{data?.resource ?? "shop"}</p>, header: 'Resource'
    },
    {
        field: "createdAt",
        header: 'created At',
        sortable: true,
        editor: (options: ColumnEditorOptions) => {
            return inputsEditor(options, "date")
        },
    },
    // {
    //     field: "paidOn",
    //     header: 'Paid At',
    //     enabledEdit: true,
    //     type: "date"
    // },

]

import React from 'react'

type Props = {}

const Tooltips = (props: Props) => {
    return (
        <Tooltip target=".itemName" position='bottom'></Tooltip>
    )
}

export default Tooltips