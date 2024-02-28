import React from 'react'
import SaleTable from './table/SaleTable'
import { auth } from '../../auth';
import { redirect } from 'next/navigation';
import { getClients, getSaleList } from '@/lib/data';

type Props = {
    searchParams: { type: string };
}

const page = async ({ searchParams }: Props) => {
    const session = await auth()
    if (!session?.user.email) {
        return redirect('/auth/login')
    }

    const q = new URLSearchParams(searchParams)
   const sales = await getSaleList(q)

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
    const clients = await getClients()
    var [items] = await Promise.all([itemsData])

    return (
            <SaleTable searchParams={searchParams} data={sales?.saleList ?? []}
                clientsData={clients?.data ?? []} totalrows={sales?.totalRows ?? 0}
                itemsData={items?.data ?? []} sale={sales?.totalSaleAmount ?? 0} />

    )
}

export default page
