'use server'
import React from 'react'
import Datatable from './Datatable';
import { getServerSessionGlobal } from '../authOptions';
import { redirect } from 'next/navigation';

type Props = {}

const Clients = async () => {
    const session = await getServerSessionGlobal()
    if (!session) {
        return redirect('/api/auth/signin')
    }


    const getClients = await fetch(process.env.API_URL + 'client', {
        cache: "no-cache",
        next: {
            tags: ["Clients"]
        }
    })

    const Clients = await getClients.json()
    const { data, totalCredit } = Clients

    return (

        <>
            <Datatable data={data ?? []} amount={totalCredit ?? 0} />
        </>
    )
}

export default Clients