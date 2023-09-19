import { revalidateTag } from "next/cache"

export const onStatusChange = async (data: Object[] | undefined, status: number, paidOn: Date) => {

    const res = await fetch('http://localhost:3000/api/sale',
        {
            method: "PATCH",
            body: JSON.stringify({ data: data, status: status, paidOn, statusUpdate: true }),
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