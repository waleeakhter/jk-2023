'use server'
import React from 'react'
import Datatable from './Datatable';

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
            {/* <Button onClick={addItems} >'Add Items'</Button> */}
            <Datatable data={Clients} />
        </>
    )
}

export default Clients