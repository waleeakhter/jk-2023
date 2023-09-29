import React from 'react'
import SaleTable from './table/SaleTable'
import { getClients } from './SaleActions/ServerActions';
import LayoutWithHeader from '../LayoutWithHeader';
type Props = {
    searchParams: { type: string };
}

const page = async ({ searchParams }: Props) => {
    const q = new URLSearchParams(searchParams)

    const getSales = async () => {
        const res = await fetch(`${process.env.API_URL}sale?page=${1}&pageSize=${10}&` + q, {
            cache: 'no-cache',
            next: {
                tags: ["sale"],
            }

        })
        return res.json()
    }
    const getItems = async () => {
        const res = await fetch(process.env.API_URL + "item", {
            cache: "no-cache",
            next: {
                tags: ["item"]
            }
        })
        return res.json();
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const itemsData = getItems()
    const clientsData = getClients()
    const salesData = getSales()
    const [items, clients, sales] = await Promise.all([itemsData, clientsData, salesData])

    return (
        <LayoutWithHeader >
            <SaleTable searchParams={searchParams} data={sales.data}
                clientsData={clients.data ?? []}
                itemsData={items.data} sale={sales.totalSale} />
        </LayoutWithHeader>
    )
}

export default page
