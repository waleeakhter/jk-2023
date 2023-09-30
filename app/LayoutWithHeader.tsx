import React from 'react'
import Header from './components/Header'
import Protected from './Protected'
import { getServerSession } from 'next-auth'
import { nextAuthOptions } from './authOptions'

const LayoutWithHeader = async (
    {
        children,
    }: {
        children: React.ReactNode
    }
) => {
    const session = await getServerSession(nextAuthOptions)
    return (
        <Protected session={session}>
            <Header />
            {children}
        </Protected>
    )
}

export default LayoutWithHeader