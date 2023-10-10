import React from 'react'
import { getServerSessionGlobal } from './authOptions'
import { redirect } from 'next/navigation'

const Home = async () => {
    const session = await getServerSessionGlobal()
    if (!session) {
        return redirect('/api/auth/signin')
    }
    return (

        <h1>Dashboard</h1>

    )
}

export default Home