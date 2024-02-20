"use server"
import { Sale } from "@/types/typings"
import { revalidateTag } from "next/cache"



export const onStatusChange = async (data: Sale[] | Sale | undefined, status: number, paidOn: Date) => {

    const res = await fetch(process.env.API_URL + 'sale',
        {
            method: "PATCH",
            body: JSON.stringify({ data: data, status: status, paidOn, statusUpdate: true }),
            cache: 'no-cache',
        }
    )
    revalidateTag("sale")
    const update = await res.json()
    console.log(update, "___update___")
    return update
}

export const getClients = async () => {
    const res = await fetch(process.env.API_URL + "client", {
        cache: "no-cache",
        next: {
            tags: ["clients"]
        }
    })
    return res.json()
}