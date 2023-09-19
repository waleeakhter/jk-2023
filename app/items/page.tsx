'use server'
import React from 'react'
import Datatable from './Datatable'

type Props = {
    searchParams: { type: string }
}
const page = async ({ searchParams }: Props) => {
    const q = new URLSearchParams(searchParams).toString();
    const getItems = await fetch(process.env.API_URL + 'item?' + q, {
        cache: "no-cache",
        next: {
            tags: ["item"]
        }
    })
    const Items = await getItems.json()
    return (
        <div>
            <>
                <Datatable data={Items.data} showPrice={Items.totalAmount} />
            </>
        </div>
    )
}

export default page