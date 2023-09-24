'use server'
import React from 'react'
import Datatable from './Datatable'
import Protected from '../Protected'
import LayoutWithHeader from '../LayoutWithHeader'

type Props = {
    searchParams: { type: string },
    router: any
}
const page = async ({ searchParams, router }: Props) => {
    const q = new URLSearchParams(searchParams).toString();
    const getItems = await fetch(process.env.API_URL + 'item?' + q, {
        cache: "no-cache",
        next: {
            tags: ["item"]
        }
    })
    const Items = await getItems.json()
    return (
        <LayoutWithHeader>
            <Datatable data={Items.data} showPrice={Items.totalAmount} />
        </LayoutWithHeader>
    )
}

export default page