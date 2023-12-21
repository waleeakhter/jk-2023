"use server"
import React from 'react'
import DataTable from './DataTable'
import { auth } from '../../auth'
import { redirect } from 'next/navigation'
import { getLogs } from './functions'
import { Log } from '@/types/typings'

const Logs = async () => {
    const session = await auth()
    if (!session?.user.email) {
        return redirect('/auth/login')
    }



    const logs: Array<Log> = await getLogs(process.env.API_URL)
    return (
        <DataTable data={logs ?? []}></DataTable>
    )
}

export default Logs