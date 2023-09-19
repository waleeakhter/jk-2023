import React from 'react'
import { nextAuthOptions } from './options'
import { getServerSession } from 'next-auth'
import Login from './auth/login/page'

const Home = async () => {
    const session = await getServerSession(nextAuthOptions)
    return (
        <div>
            {session ? "login" : <pre>{JSON.stringify(session, null, 2)}</pre>}
        </div>
    )
}

export default Home