import React, { Suspense } from 'react'
import SaleTable from './table/SaleTable'
import Loading from '../loading';
import DataTableLoading from '../DatatableLoading';
import { columns } from './table/columns';
type Props = {
    searchParams: { type: string };
}

const page = ({ searchParams }: Props) => {
    return (
        <SaleTable searchParams={searchParams} />
    )
}

export default page
