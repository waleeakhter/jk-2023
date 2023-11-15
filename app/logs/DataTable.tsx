"use client"
import { Table } from 'antd'
import React from 'react'
import { logTableColumns } from './Columns'

const DataTable = ({ data }: { data: Array<{}> }) => {
    return (
        <Table dataSource={data ?? []} columns={logTableColumns}></Table>
    )
}

export default DataTable