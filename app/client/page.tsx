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

    return (

        <>
            <LayoutWithHeader>

                <Datatable data={Clients} />
            </LayoutWithHeader>
        </>
    )
}

export default Clients