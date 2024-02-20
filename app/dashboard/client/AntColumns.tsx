import { Client } from "@/types/typings";
import { Button, Flex, Form, FormInstance, Input, InputNumber, Popconfirm, Typography } from "antd";
import type { ColumnsType } from 'antd/es/table';
import { useState } from "react";
import { EditOutlined, CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
import { updateClientCredit } from "./serverAction";
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: any;
    title: any;
    inputType: 'number' | 'text';
    record: Client;
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
}) => {
    const inputNode = inputType === 'number' ? <InputNumber min={0} /> : <Input />;

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    initialValue={record[dataIndex as keyof Client]}
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



export const AntColumns = (form: FormInstance, data: Array<Client>, showModal: Function) => {
    const [editingKey, setEditingKey] = useState('');
    const isEditing = (record: Client) => record._id === editingKey;
    const edit = (record: Client) => {
        form.setFieldsValue({ name: record.name, debit: record.debit, credit: record.credit });
        setEditingKey(record._id ?? "");
    };
    const save = async (key: React.Key) => {
        try {
            const row = (await form.validateFields()) as Client;

            console.log(row, "row")
            const client = data.find((item) => key === item._id);
            const newData = { ...client, ...row };
            console.log(newData, "data")
            updateClientCredit(newData).then(() => setEditingKey(''));
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };
    const cancel = () => {
        setEditingKey('');
    };
    return [
        {
            key: "name",
            title: 'name',
            dataIndex: 'name',
            width: '25%',
        },
        {
            title: 'Credit',
            dataIndex: 'credit',
            width: '15%',
            onCell: (record, index) => ({
                record,
                inputType: "number",
                dataIndex: "credit",
                title: "Credit",
                editing: isEditing(record),
            }),
        },
        {
            title: 'Debit',
            dataIndex: 'Debit',
            width: '40%',
            onCell: (record, index) => ({
                record,
                inputType: "number",
                dataIndex: "debit",
                title: "Debit",
                editing: isEditing(record),
            }),

        },
        {
            title: 'Action',
            dataIndex: 'operation',
            render: (_: any, record: Client) => {
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
                            <Button shape="circle" size="small" icon={<EditOutlined />} disabled={editingKey !== ''} onClick={() => edit(record)} />}
                        <Button icon={<EyeOutlined />} shape="circle" size="small" htmlType="button" onClick={() => showModal(record)} />
                    </Flex>
                );
            }
        }
    ] as ColumnsType<Client>
}