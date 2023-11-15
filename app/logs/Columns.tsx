import { Log } from "@/typings";
import { Tooltip, Typography } from "antd";
import type { ColumnsType } from 'antd/es/table';
import Paragraph from "antd/es/typography/Paragraph";

export const logTableColumns: ColumnsType<Log> = [
    {
        title: 'Index',
        dataIndex: 'key',
        rowScope: 'row',
        render(_, __, index) {
            return <span>{index + 1}</span>;
        },
        width: 70,
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (text: string, record) => {
            return <Tooltip placement="bottomLeft" title={<p className=' text-xs '>{record.name}</p>} >{record.name}</Tooltip>
        },
        sorter: {
            compare: (a, b) => a.name.localeCompare(b.name),
            multiple: 1,
        }
        ,
        ellipsis: {
            showTitle: false,
        },
        filterMode: "menu",
        width: "fit-content",
    },
    {
        title: 'Type',
        dataIndex: 'logType',
        key: 'logType',
        width: 120
    },
    {
        title: 'Datails',
        dataIndex: 'details',
        key: 'details',
        render: (value) => {
            value?.item && delete value?.item;
            return value ? <Typography > <pre className="text-xs">
                {Object.keys(value).map((key, index) => <div key={index}>{`${key}: ${value[key]}`}</div>)}
            </pre> </Typography> : ''
        },
        width: 180,
    },
    {
        title: 'Date',
        dataIndex: 'createdAt',
        key: 'createdAt',
    },
];
