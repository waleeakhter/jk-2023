'use server'
import React from 'react'
import Datatable from './Datatable';
import { auth } from '../../auth'
import { redirect } from 'next/navigation';

type Props = {}

const Clients = async () => {
    const session = await auth()
    if (!session?.user.email) {
        return redirect('/auth/login')
    }


    const getClients = await fetch(process.env.API_URL + 'client', {
        cache: "no-cache",
        next: {
            tags: ["Clients"]
        }
    })

    const Clients = await getClients.json()

    return (

        <>
            <Datatable values={Clients ?? []}  />
        </>
    )
}

export default Clients