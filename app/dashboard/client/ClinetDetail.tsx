import React, { useEffect, useState } from 'react';
import { Button, Modal, Select } from 'antd';
import { Client } from '@/types/typings';
import { useQuery } from '@tanstack/react-query';
import { Table, Skeleton } from 'antd';
import { ClinetDetailColumns, paymentHistoryColumns } from './ClinetDetailColumns';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { MomentInput } from 'moment';
import moment from 'moment';
type Props = { setIsModalOpen: (arg0: boolean) => void, isModalOpen: boolean, id: string }

const ClientDetail: React.FC<Props> = ({ id, isModalOpen, setIsModalOpen }) => {

    const [clientId, setClient] = useState("");
    const [tabIndex, setTabIndex] = useState("1");
    const { data, isPending } = useQuery({
        queryKey: ['client', { clientId, id }],
        queryFn: async () => {
            const res = await fetch(`/api/client/${clientId === "" ? id : clientId}`)
            console.log(res, "res")
            return res.json().then(data => data);;
        },
        enabled: id ? true : false,
        staleTime: 10000,

    })
    const { data: payments, isPending: pending } = useQuery({
        queryKey: ['payments', { clientId, id }],
        queryFn: async () => {
            const res = await fetch(`/api/client/payment/${clientId === "" ? id : clientId}`)
            console.log(res, "res")
            return res.json().then(data => data);
        },
        enabled: id ? true : false,
        staleTime: 10000,

    })
    const { data: clientsList, isPending: loading } = useQuery({
        queryKey: ['clients'],
        queryFn: async () => {
            const res = await fetch(`/api/client`)
            console.log(res, "res")
            return res.json().then(data => data.data.sort((a: { createdAt: MomentInput; }, b: { createdAt: MomentInput; }) => {
                const dateA: Date = moment(a.createdAt, "DD-MM-YY").toDate();
                const dateB: Date = moment(b.createdAt, "DD-MM-YY").toDate();
                return dateA.getTime() - dateB.getTime();
            }));
        },
        enabled: id ? true : false,
        staleTime: 10000,

    })

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setClient("");
    };
    const onChange = (key: string) => {
        console.log(key);
        setTabIndex(key)
    };

    const getData = () => {
        switch (tabIndex) {
            case "1":
                return data?.data;
            case "2":
                return payments?.data;
            default:
                return []
        }
    }

    return (
        <>
            <Modal destroyOnClose styles={{ content: { height: "100%", overflowY: "auto" } }} footer={null} keyboard={false} centered width={"100vw"}
                title={<Skeleton loading={isPending} paragraph={{ rows: 0 }}>{`${data?.client?.name} Detail (Total Credit : ${data?.client?.credit})`}</Skeleton>}
                open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <div className='my-5 w-48 '>
                    <label htmlFor="brand"><strong>Select Brand</strong></label>
                    <Select showSearch value={clientId === "" ? id : clientId} id='brand' size='large' className='w-full'
                        fieldNames={{ value: "_id", label: "name" }}
                        loading={loading}
                        filterOption={(input, option) =>
                            (option?.name?.toLocaleLowerCase() ?? '').includes(input.toLocaleLowerCase())}
                        options={clientsList ?? []} placeholder='Select a client'
                        onChange={(e) => setClient(prev => e)} />
                </div>
                <Tabs defaultActiveKey="1" items={[{ key: "1", label: "Items List" }, { key: "2", label: "Payment History" }]} onChange={onChange} />
                <Table sticky={{ offsetScroll: 1 }} scroll={{ y: "64vh", scrollToFirstRowOnChange: true }} size='small'
                    loading={isPending} dataSource={getData()}
                    rowKey={(record) => record._id}
                    columns={tabIndex === "2" ? paymentHistoryColumns
                        : ClinetDetailColumns} />
            </Modal>
        </>
    );
};

export default ClientDetail;