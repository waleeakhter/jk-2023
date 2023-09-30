"use client"
import React from 'react'
import { SessionProvider } from "next-auth/react"
import { Session } from 'next-auth'
import { useRouter } from 'next/navigation'
import Header from './components/Header'
type Props = { children: React.ReactNode, session: Session | null }

const Protected = ({ children, session }: Props) => {
    const router = useRouter()
    // if (session?.user?.name === undefined) {
    //     router.push("/auth/login")
    // }
    return (
        <SessionProvider session={session}>
            <Header />
            {children}
        </SessionProvider>
    )
}

export default Protected