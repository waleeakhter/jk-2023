"use client"
import { Table } from 'antd'
import React, { ChangeEvent, useState } from 'react'
import { logTableColumns } from './Columns'
import { Input, Flex } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { getLogs } from './functions';
import { Item } from '@/types/typings';

interface Filters {
    name: string;
    item: string;
}
const DataTable = ({ data }: { data: Array<{}> }) => {
    const { Search } = Input;
    const [filters, setFilters] = useState<Filters>({
        name: '',
        item: ""
    })

    const createSearchParams = (filters: Filters) => {
        const params: string[] = [];

        for (const key in filters) {
            if (Object.prototype.hasOwnProperty.call(filters, key)) {
                const value = filters[key];
                if (value !== null && value !== undefined && value !== '') {
                    params.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
                }
            }
        }

        return params.join('&');
    }

    const { data: newLogs, isPending, refetch, isRefetching } = useQuery({
        queryKey: ["logs", filters],
        queryFn: async () => {
            const _params = createSearchParams(filters)
            const res = await getLogs(undefined, _params);
            return res
        },
        initialData: data ?? [],
        enabled: false,
    })

    const onSearched = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.currentTarget;
        console.log(value)
        setFilters(prev => ({ ...prev, name: value }))
    }
    const onEnter = () => {
        refetch()
    }
    return (
        <Flex vertical gap={10} className='mt-5'>
            <Flex justify='end' className=' px-4 '>
                <Search list='search-log' className='max-w-[25rem]' loading={isRefetching} onChange={onSearched} onPressEnter={onEnter}
                    allowClear size='large' placeholder="Enter keywords..." />

            </Flex>
            <Table loading={isPending || isRefetching} rowKey={(record) => record._id as string} dataSource={newLogs} columns={logTableColumns}></Table>
        </Flex>
    )
}

export default DataTable