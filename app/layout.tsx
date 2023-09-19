'use client'
// import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import 'primeicons/primeicons.css';
import Header from './components/Header';
import "react-datepicker/dist/react-datepicker.css";
import './globals.scss'
import { QueryClient, QueryClientProvider } from './globalexport';
import { Hydrate } from '@tanstack/react-query';
import React from 'react';
const inter = Inter({ subsets: ['latin'] })

// export const metadata: Metadata = {
//   title: 'JK',
//   description: 'Developed By Waleed Akhter',
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [queryClient] = React.useState(() => new QueryClient())
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}
        className={inter.className}>
        <QueryClientProvider client={queryClient}>
          <Hydrate >
            <>
              <Header />
              {children}

            </>
          </Hydrate>
        </QueryClientProvider>
      </body>
    </html>
  )
}
