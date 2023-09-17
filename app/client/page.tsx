'use server'
import React from 'react'
import Datatable from '../components/Datatable/Datatable';

type Props = {}

const Clients = async () => {
    const getClients = await fetch(process.env.API_URL + 'client', {
        cache: "no-cache",
        next: {
            tags: ["Clients"]
        }
    })

    const Clients = await getClients.json()
    const columns = [
        { field: 'name', header: 'Item' },
        { field: 'credit', header: 'Credit' },
        { field: 'debit', header: 'Debit' },
    ]

    const CSVheaders = [
        { key: 'name', label: 'Item' },
        { key: 'credit', label: 'Credit' },
        { key: 'debit', label: 'Debit' },
    ]
    return (

        <>
            {/* <Button onClick={addItems} >'Add Items'</Button> */}
            <Datatable data={Clients} columns={columns} search={['name', 'type']} hideDeleteBtn={false} tableName={'Items'} targetRoute={'item'} />
        </>
    )
}

export default Clients