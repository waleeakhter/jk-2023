import React from 'react'
import Header from '../Header'
import AuthProvider from '@/app/context/AuthProvider'
import StyledComponentsRegistry from '@/app/lib/AntdRegistry'
import { auth } from '@/app/auth'

type Props = {}

const DashboardLayout = async ({
    children,
}: {
    children: React.ReactNode
}) => {
    const session = await auth()
    return (
        <>
             <AuthProvider>
          <Header session={session} />
          <StyledComponentsRegistry>
            {children}
          </StyledComponentsRegistry>
        </AuthProvider>
        </>
    )
}

export default DashboardLayout