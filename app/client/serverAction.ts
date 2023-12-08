"use server"

import { Client } from "@/types/typings"
import { revalidateTag } from "next/cache"

export const updateClientCredit = async ( data: Client & {_id : string}) => {

    const res = await fetch(`${process.env.API_URL}/client`, {
        method: "PATCH",
        body: JSON.stringify( data),
        cache: 'no-cache',
    })
    const response = await res.json();
    console.log(response)
    if (response?.status) {
        revalidateTag('Clients')
    }
    return data
}