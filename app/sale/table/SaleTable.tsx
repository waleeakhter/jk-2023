'use server'
import React from 'react';
import Filters from './../table/filters/Filters';
import Datatable from '../../components/Datatable/Datatable';
import Tooltips, { columns } from './columns';
import { MixInterfaces, Sale } from '@/typings';
import moment from 'moment';
import SaleForm from './../form/SaleForm';
import { getClients } from '../SaleActions/ServerActions';
import ExportData from '@/app/components/ExportData';

type Props = {
    searchParams: { type: string };
}

const SaleTable = async ({ searchParams }: Props) => {

    const q = new URLSearchParams(searchParams)
    const res = await fetch(process.env.API_URL + `sale?page=${1}&pageSize=${10}&` + q.toString(), {
        cache: 'no-cache',
        next: {
            tags: ["sale"],
        }

    })
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const sales: { data: MixInterfaces[], totalSale: number } = await res.json();
    const exportColumns = [
        { header: "Client", dataKey: "client" },
        { header: "Item", dataKey: "item" },
        { header: "Type", dataKey: "type" },
        { header: "Price", dataKey: "sell_price" },
        // { header: "Purchase Price", dataKey: "purchase_price" },
        { header: "QTY", dataKey: "sell_quantity" },
        { header: "T/A", dataKey: "total_amount" },
        // { header: "Total P/Price", dataKey: "p_total_amount" },
        { header: "Date", dataKey: "createdAt" },
        { header: "Dis", dataKey: "dis" },
        { header: "Check", dataKey: "check" }
    ]
    const exportData: Array<Sale> = sales.data.map(el => {
        return {
            client: el.client.name,
            item: el.item['name'],
            type: el.item['type'],
            sell_price: el.sell_price,
            // purchase_price: el.item["purchase_price"],
            sell_quantity: el.sell_quantity,
            total_amount: el.total_amount,
            // p_total_amount: el.item["purchase_price"] * el.sell_quantity,

            createdAt: moment(el.createdAt).format("DD-MM-YY"),
        }
    }

    ).sort((a, b) => a.client.localeCompare(b.client))
        .sort((a, b) => {
            const dateA: Date = moment(a.createdAt, "DD-MM-YY").toDate();
            const dateB: Date = moment(b.createdAt, "DD-MM-YY").toDate();
            return dateA.getTime() - dateB.getTime();
        }).sort((a, b) => a.type.localeCompare(b.type))

    const clientsData = await getClients();
    return (
        <div className='relative'>
            <Filters searchParams={q} clients={clientsData} />

            <Datatable data={sales.data} columns={columns ?? []} showSale={sales.totalSale}
                search={['item.name', 'client.name', 'status , item.type,createdAt']}
                tableName={'Sale'} targetRoute={'sale'} addComponent={<SaleForm />}
                exportData={<ExportData data={exportData} exportColumns={exportColumns} />} />
            <Tooltips />
        </div>
    )
}

export default SaleTable;