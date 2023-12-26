"use client"
import React from 'react'
import Header from '../Header'
import AuthProvider from '@/app/context/AuthProvider'
import StyledComponentsRegistry from '@/app/lib/AntdRegistry'

type Props = {}

const DashboardLayout =  ({
    children,
}: {
    children: React.ReactNode
}) => {
    return (
            <div>
                <Header  />
                <main>
                    {children}
                </main>
            </div>
    )
}

export default DashboardLayout