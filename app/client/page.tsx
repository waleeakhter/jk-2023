'use server'
import React from 'react'
import Datatable from './Datatable';

type Props = {}
let apiURL = ""
if (process.env.NODE_ENV === "production") {
    apiURL = process.env.Live_API_URL ?? " "
}

if (process.env.NODE_ENV == "development") {
    process.env.API_URL
}
const Clients = async () => {
    const getClients = await fetch(apiURL + 'client', {
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