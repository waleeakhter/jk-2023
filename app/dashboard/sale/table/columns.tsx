import { ColumnEditorOptions, ColumnProps } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { InputNumber, DatePicker, Select, Badge, Tag, Radio, Button, Form, FormInstance } from 'antd';
import dayjs from 'dayjs';
const inputsEditor = (options: ColumnEditorOptions, type: string, form: FormInstance) => {
    const { value, rowData, field, editorCallback } = options
    switch (type) {
        case "number":
            return <Form.Item name={field} rules={[{ required: true, message: "Required" }]} className='mb-[0_!important]' initialValue={value || rowData[field]}>
                <InputNumber className=' max-w-[4rem] w-16 overflow-hidden ' step={1} type="text" min={1} 
                    formatter={(value) => field === "sell_quantity" ? `${value}`.replace(/[^0-9]/g, '') : value}
                    value={value || rowData[field]}
                    onChange={(value) => { editorCallback ? editorCallback(value ?? 0) : ""; form.setFieldValue(field, value) }} />
            </Form.Item>
                ;
        case "text":
            return <Form.Item name={field} rules={[{ required: true, message: "Required" }]} className='mb-[0_!important]'>
                <InputText step={1} type="text"
                    value={value || rowData[field] || " "} onChange={(e) => editorCallback ? editorCallback(e.target.value) : ""} />
            </Form.Item>;
        case "date":
            return <Form.Item name={field} rules={[{ required: true, message: "Required" }]}
                className='mb-[0_!important]' initialValue={dayjs(value || rowData[field])}>
                <DatePicker value={dayjs(value || rowData[field])}
                    className=' z-[100] ' format="DD-MM-YYYY"
                    disabledDate={(current) => current.subtract(1, "day").isAfter(new Date())}
                    placeholder="Select a date" bordered={false}
                    onChange={(e) => editorCallback ? editorCallback(e) : ""} />
            </Form.Item>
        case "select":
            return <Form.Item name={field} rules={[{ required: true, message: "Required" }]} className='mb-[0_!important]'>
                <Select placeholder={"Select a user"} value={value || rowData[field] || " "}
                    onChange={(e: any) => editorCallback ? editorCallback(e) : ""} />
            </Form.Item>;
        default:
            break;
    }

}
export const columns = (form: FormInstance) => {
    return [
        {
            field: "client.name", header: 'Client', sortable: true,
            style: { width: "100px" },
            className: "itemName max-w-[100px] text-ellipsis overflow-hidden whitespace-nowrap",
            body: (data: { client: { name: string } }) => <Tooltip title={data.client.name} placement="bottomLeft">
                <p className="itemName max-w-[20rem] text-ellipsis overflow-hidden whitespace-nowrap ">{data.client.name}</p>
            </Tooltip>,
        },
        {
            body: (data: { item: { name: string } }) => <Tooltip title={data.item.name} placement="bottomLeft">
                <p className="itemName max-w-[20rem] text-ellipsis overflow-hidden whitespace-nowrap ">{data.item.name}</p>
            </Tooltip>,
            header: 'Item',
            sortable: true,
            field: "item.name",
        },
        {
            field: 'item.type', header: 'Type', sortable: true,

        },
        {
            field: "sell_price", header: 'Price',
            editor: (options: ColumnEditorOptions) => {
                return inputsEditor(options, "number", form)
            },

        },
        {
            field: 'sell_quantity', header: 'Quantity',
            editor: (options: ColumnEditorOptions) => {
                return inputsEditor(options, "number", form)
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
            body: (data: { createdAt: string }) => moment(data.createdAt).format('LL'),
            editor: (options: ColumnEditorOptions) => {
                return inputsEditor(options, "date", form)
            },
        },

    ] as Array<ColumnProps>
}

import React from 'react'
import { Dropdown, Tooltip } from 'antd';
import moment from 'moment';

type Props = {}

const Tooltips = (props: Props) => {
    return (
        <Tooltip placement="bottomLeft"></Tooltip>
    )
}

export default Tooltips