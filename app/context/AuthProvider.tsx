"use client"
import React from 'react'
import { SessionProvider } from "next-auth/react"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
type Props = { children: React.ReactNode }

const Protected = ({ children }: Props) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false, 
            },
        },
    })
    return (
        <SessionProvider >
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </SessionProvider>
    )
}

export default Protected