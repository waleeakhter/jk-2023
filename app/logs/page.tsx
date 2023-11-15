"use server"
import React from 'react'
import DataTable from './DataTable'
import { getServerSessionGlobal } from '../authOptions'
import { redirect } from 'next/navigation'

const Logs = async () => {
    const session = await getServerSessionGlobal()
    if (!session) {
        return redirect('/api/auth/signin')
    }


    const getLogs = await fetch(process.env.API_URL + 'logs', {
        cache: "no-cache",
        next: {
            tags: ["logs"]
        }
    })

    const logs = await getLogs.json().then(data => data.data)
    return (
        <DataTable data={logs ?? []}></DataTable>
    )
}

export default Logs