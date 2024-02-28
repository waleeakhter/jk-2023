'use server'
import React from 'react'
import Datatable from './Datatable';
import { auth } from '../../auth'
import { redirect } from 'next/navigation';
import { getClients } from '@/lib/data';

type Props = {
    searchParams: { type: string };
}

const Clients = async ({ searchParams } : Props) => {
    const session = await auth()
    if (!session?.user.email) {
        return redirect('/auth/login')
    }
    const q = new URLSearchParams(searchParams)

    // const getClients = await fetch(process.env.API_URL + 'client?'+ q, {
    //     cache: "no-cache",
    //     next: {
    //         tags: ["Clients"]
    //     }
    // })

    const Clients = await getClients(q)

    return (
            <Datatable values={Clients ?? []}  />
    )
}

export default Clients