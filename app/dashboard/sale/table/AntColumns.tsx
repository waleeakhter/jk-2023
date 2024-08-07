import { Client, Sale } from "@/types/typings";
import { Button, DatePicker, Flex, Form, FormInstance, Input, InputNumber, Popconfirm, Space, TableColumnType, Tooltip, Typography } from "antd";
import type { ColumnsType } from 'antd/es/table';
import { useState } from "react";
import { EditOutlined, CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { cancelSaleItem } from "@/app/components/Datatable/functions";
import { PlusOutlined, ReloadOutlined, DeleteFilled } from '@ant-design/icons';
import { updateOrder } from "@/app/components/Datatable/serverActions";
import SaleActions from "../SaleActions";
import moment from "moment";
import { SearchOutlined } from '@ant-design/icons';
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: any;
    title: any;
    inputType: 'number' | 'text' | 'date';
    record: Sale;
    index: number;
    children: React.ReactNode;
}


export const EditableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    defaultValue,
    ...restProps
}, form: FormInstance) => {
    const inputNode = inputType === 'number' ? <InputNumber min={1} defaultValue={defaultValue as number} /> : inputType === "date" ?
        <DatePicker format={"DD/MM/YY"} /> : <Input />;

    return (
        <td {...restProps}>

            {editing ? (
                <Form.Item
                    initialValue={defaultValue}
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}

                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};



export const AntColumns = (form: FormInstance, data: Array<Sale>, startTransition: React.TransitionStartFunction , getColumnSearchProps : (dataIndex: keyof Sale) => TableColumnType<Sale>) => {
    const [editingKey, setEditingKey] = useState('');
    const isEditing = (record: Sale) => record._id === editingKey;
    const edit = (record: Sale) => {
        form.setFieldsValue({ sell_price: record.sell_price, sell_quantity: record.sell_quantity, createdAt: dayjs(record.createdAt) });
        setEditingKey(record._id ?? "");
    };
    const save = async (key: React.Key) => {
        try {
            const row = (await form.validateFields()) as Sale;

            console.log(row, "row")
            const client = data.find((item) => key === item._id);
            const newData = { ...client, ...row };
            console.log(newData, "data")
            updateOrder(newData as any, "sale").then(() => setEditingKey(''));
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };
    const cancel = () => {
        setEditingKey('');
    };
    return [
        {
            key: "client",
            title: 'Client',
            dataIndex: 'client',
            render: (_, record) => <Tooltip placement="bottomLeft" title={<span className=' text-xs '>{record.client?.name}</span>} >{record.client?.name}</Tooltip>
            ,
            width: 'auto',
            ellipsis: true,
            sorter: (a, b) => {
                const nameA = a.client.name.toLowerCase();
                const nameB = b.client.name.toLowerCase();

                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                // If names are equal, sort by another property (e.g., ID)
                return a._id.localeCompare(b._id);
            },
        },
        {
            title: 'Item',
            dataIndex: 'item.name',
            render: (_, record) => <Tooltip placement="bottomLeft" title={<span className=' text-xs '>{record.item?.name}</span>} >{record.item?.name}</Tooltip>,
            width: 'auto',
            ellipsis: true,
            sorter: (a, b) => a.item.name.localeCompare(b.item.name),
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
                <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                  <Input
                    
                      placeholder={`Search Item`}
                      value={selectedKeys[0]}
                      onChange={(e) => {setSelectedKeys(e.target.value ? [e.target.value] : []); confirm({ closeDropdown: false })}}
                      onPressEnter={() => ""}
                      style={{ marginBottom: 8, display: 'block' }}
                  />
                  <Space>
                
                    <Button
                      onClick={() => { setSelectedKeys([]);   confirm({ closeDropdown: true })}}
                      size="small"
                      style={{ width: 90 }}
                    >
                      Reset
                    </Button>
              
                    <Button
                      type="link"
                      size="small"
                      onClick={() => {
                        close();
                      }}
                    >
                      close
                    </Button>
                  </Space>
                </div>
              ),
            filterIcon: (filtered: boolean) => (
                <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
              ),
              onFilter: (value, record) =>
               record.item.name.toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    
            // ...getColumnSearchProps("item.name")
        },
        {
            title: 'Type',
            dataIndex: 'item.type',
            width: '80px',
            render: (_, record) => record.item?.type,
        },
        {
            title: 'Price',
            dataIndex: 'sell_price',
            width: "100px",
            onCell: (record, index) => ({
                record,
                inputType: "number",
                dataIndex: "sell_price",
                title: "Price",
                editing: isEditing(record),
            }),

        },
        {
            title: 'Qty',
            dataIndex: 'sell_quantity',
            width: '100px',
            onCell: (record, index) => ({
                record,
                inputType: "number",
                dataIndex: "sell_quantity",
                title: "Qty",
                editing: isEditing(record),
            }),

        },
        {
            title: 'Total',
            dataIndex: 'total_amount',
            width: "100px",
            render(_, record) {
                return record.total_amount + "€"
            },

        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: '100px',
            render(_, record) {
                return record.status === 1 ? <Typography.Text type="success">Paid</Typography.Text> : <Typography.Text type="danger">Unpaid</Typography.Text>
            },

        },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: '100px',
            render(_, record) {
                return dayjs(record.createdAt).format('DD-MM-YYYY')
            },
            onCell: (record, index) => ({
                record,
                inputType: "date",
                dataIndex: "createdAt",
                title: "Date",
                editing: isEditing(record),
            }),
            sorter: {
                compare: (a, b) => {
                    const dateA: Date = moment(a.createdAt, "DD-MM-YY").toDate();
                    const dateB: Date = moment(b.createdAt, "DD-MM-YY").toDate();
                    return dateB.getTime() - dateA.getTime(); // Sort in descending order
                },
                multiple: 2,
            },

        },
        {
            title: 'Action',
            dataIndex: 'operation',
            render: (_: any, record: Sale) => {
                const editable = isEditing(record);
                return (
                    <Flex gap={4} align="center">
                        {editable ?
                            <span>
                                <Button htmlType="button" shape="circle" size="small" icon={<CheckOutlined />} onClick={() => save(record._id)} style={{ marginRight: 8 }}>

                                </Button>
                                <Popconfirm title="Sure to cancel?" onConfirm={cancel} placement="bottom" >
                                    <Button icon={<CloseOutlined />} shape="circle" size="small" htmlType="button" />
                                </Popconfirm>
                            </span>
                            :
                            <Button shape="circle" size="small" icon={<EditOutlined />} disabled={editingKey !== ''} onClick={() => edit(record)} />
                        }
                        <SaleActions rowData={record} startTransition={startTransition} />
                        <Button danger shape="circle"
                            size='small' type='primary' icon={<DeleteFilled />}
                            onClick={(e) => cancelSaleItem(e, record)} />
                    </Flex>
                );
            }
        }
    ] as ColumnsType<Sale>
}