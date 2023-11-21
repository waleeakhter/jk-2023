import React from 'react'
import { getServerSessionGlobal } from './authOptions'
import { redirect } from 'next/navigation'
import { auth } from './auth'

const Home = async () => {
    const session = await auth()
    if (!session?.user?.email) {
        return redirect('/api/auth/signin')
    }
    return (

        <h1>{JSON.stringify(session, null, 2)}</h1>

    )
}

export default Home