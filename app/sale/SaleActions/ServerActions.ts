'use server'

import { revalidateTag } from "next/cache"

export const onStatusChange = async (_id: string[], status: number, paidOn: Date) => {
    console.log(_id)
    const res = await fetch('http://localhost:3000/api/sale',
        {
            method: "PATCH",
            body: JSON.stringify({ _id: _id, status: status, paidOn }),
            cache: 'no-cache',
        }
    )
    revalidateTag("sale")
    const update = await res.json()
    return update
}

export const getClients = async () => {
    const res = await fetch("http://localhost:3000/api/client", {
        cache: "no-cache",
        next: {
            tags: ["clients"]
        }
    })
    return res.json()
}