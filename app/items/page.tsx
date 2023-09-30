'use server'
import React from 'react'
import Datatable from './Datatable'
import Protected from '../Protected'
import LayoutWithHeader from '../LayoutWithHeader'
import { getServerSessionGlobal } from '../authOptions'

type Props = {
    searchParams: { type: string },
    router: any
}
const page = async ({ searchParams, router }: Props) => {
    const session = await getServerSessionGlobal()

    if (session?.user?.name) {
        const q = new URLSearchParams(searchParams).toString();
        const getItems = await fetch(process.env.API_URL + 'item?' + q, {
            cache: "no-cache",
            next: {
                tags: ["item"]
            }
        })
        var Items = await getItems.json()
    }
    return (
        <Protected session={session}>
            <Datatable data={Items?.data ?? []} showPrice={Items?.totalAmount ?? 0} />
        </Protected>
    )
}

export default page