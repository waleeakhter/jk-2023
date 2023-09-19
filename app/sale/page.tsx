import React from 'react'
import SaleTable from './table/SaleTable'
import { MixInterfaces } from '@/typings';
import { getClients } from './SaleActions/ServerActions';
type Props = {
    searchParams: { type: string };
}
let apiURL = ""
if (process.env.NODE_ENV === "production") {
    apiURL = process.env.Live_API_URL ?? " "
}

if (process.env.NODE_ENV == "development") {
    process.env.API_URL
}
const page = async ({ searchParams }: Props) => {
    const q = new URLSearchParams(searchParams)
    const getSales = async () => {
        const res = await fetch(apiURL + `sale?page=${1}&pageSize=${10}&` + q.toString(), {
            cache: 'no-cache',
            next: {
                tags: ["sale"],
            }

        })
        return res.json()
    }
    const getItems = async () => {
        const res = await fetch(apiURL + "item", {
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
        <SaleTable searchParams={searchParams} data={sales.data} clientsData={clients} itemsData={items.data} sale={sales.totalSale} />
    )
}

export default page
