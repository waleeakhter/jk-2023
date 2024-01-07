'use client'
import React, { ChangeEvent, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Client } from '@/types/typings'
import AddModal from '../../components/Datatable/AddModal'
import PaymentForm from './PaymentForm'
import { Button, Card, Flex, Form, Table, Tag, Input } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import ClientDetail from './ClinetDetail'
import { AntColumns, EditableCell } from './AntColumns'
import Tooltips from '../sale/table/columns'
type Props = { values: { totalCredit: number, data: Array<Client> } }
const Datatable = ({ values }: Props) => {
    const [visible, setVisible] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [clinetID, setClientID] = useState("");
    const router = useRouter()
    const [form] = Form.useForm();
    const searchParams = useSearchParams().toString()!;
    const params = new URLSearchParams(searchParams);
    const { replace } = useRouter();
    const pathname = usePathname();
    const { Search } = Input;
    const showModal = (rowData: Client) => {
        setClientID(rowData._id)
        setIsModalOpen(true);
    };
    interface Filters {
        name: string;
    }


    const [filters, setFilters] = useState<Filters>({
        name: '',
    })




    const refreshTable = () => {
        router.refresh()
    }
    const onSearched = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.currentTarget;
        setFilters(prev => ({ ...prev, name: value }))

        if (!value) {
            params.delete("client");
            replace(pathname + '?' + params.toString())
        }
    }
    const onEnter = () => {
        if (filters.name) {
            params.set("client", filters.name)
            replace(pathname + '?' + params.toString())
        }
    }
    const RenderHeader = () => {
        return (
            <div className="flex justify-between items-center ">



            </div>
        )
    }
    return (
        <Card className=' pt-5'>
            <AddModal heading="Payments" visible={visible} setVisible={setVisible} >
                <PaymentForm clients={values.data ?? []} />
            </AddModal>
            <ClientDetail setIsModalOpen={setIsModalOpen} isModalOpen={isModalOpen} id={clinetID} />
            <Flex justify='between' className='w-full mb-2' align='center'>
                <Flex flex={1} gap={5}>
                    <h5 className="m-0 text-2xl text-gray-800 ">{"Sale"}</h5>
                    <Button size='middle' type='dashed' icon={<PlusOutlined />} onClick={() => setVisible(true)} />
                </Flex>
                <div className='text-center flex-1'>
                    <Tag color='default' className=' text-base'>{Number(values.totalCredit ?? 0) > 0 ? <p>Total Amount: {values.totalCredit} </p> : ""} </Tag>
                </div>
                <Flex justify='end' className=' px-4  '  flex={1}>
                    <Search list='search-log' className='max-w-[25rem]' onChange={onSearched} onPressEnter={onEnter}
                        allowClear size='large' placeholder="Enter keywords..." value={filters.name} />
                    <Button type="dashed" icon={<ReloadOutlined />} onClick={refreshTable} className='h-100' />
                </Flex>
            </Flex>
            <Form form={form} component={false}>
                <Table columns={AntColumns(form, values.data ?? [] as Array<Client>, showModal)} dataSource={values.data ?? []} rowKey={(record) => record._id}
                    components={{
                        body: {
                            cell: EditableCell
                        }
                    }}
                    showHeader
                    key="_id"
                    size='small'
                    scroll={{ y: "calc(100vh - 270px)", scrollToFirstRowOnChange: true }}
                    sticky={{ offsetHeader: 81 }}

                />
            </Form>
            <Tooltips />
        </Card>
    )
}

export default Datatable