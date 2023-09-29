'use server'
import React from 'react'
import Datatable from './Datatable';
import LayoutWithHeader from '../LayoutWithHeader';

type Props = {}

const Clients = async () => {
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
            <LayoutWithHeader>
                <Datatable data={data ?? []} amount={totalCredit ?? 0} />
            </LayoutWithHeader>
        </>
    )
}

export default Clients