"use server"
import React from 'react'
import DataTable from './DataTable'
import { getServerSessionGlobal } from '../authOptions'
import { redirect } from 'next/navigation'
import { getLogs } from './functions'
import { Log } from '@/typings'

const Logs = async () => {
    const session = await getServerSessionGlobal()
    if (!session) {
        return redirect('/api/auth/signin')
    }



    const logs: Array<Log> = await getLogs(process.env.API_URL)
    return (
        <DataTable data={logs ?? []}></DataTable>
    )
}

export default Logs