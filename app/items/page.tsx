'use server'
import React from 'react'
import Datatable from './Datatable'
import { redirect } from "next/navigation"
import { auth } from '../auth'

type Props = {
    searchParams: { type: string },
    router: any
}
const page = async ({ searchParams, router }: Props) => {

    const session = await auth()
    if (!session?.user.email) {
        return redirect('/auth/login')
    }
    console.log(process.env.API_URL , "/api/auth/signin")
    const q = new URLSearchParams(searchParams).toString();
    const getItems = await fetch(process.env.API_URL + 'item?' + q, {
        cache: "no-cache",
        next: {
            tags: ["item"]
        }
    })
    var Items = await getItems.json()
    return (
        <Datatable data={Items?.data ?? []} showPrice={Items?.totalAmount ?? 0} />
    )
}

export default page