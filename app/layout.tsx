
// import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import 'primeicons/primeicons.css';
import Header from './components/Header';
import "react-datepicker/dist/react-datepicker.css";
import './globals.scss'
import React from 'react';
import { getServerSession } from 'next-auth';
import { nextAuthOptions } from './authOptions';
import AuthProvider from './context/AuthProvider';
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import StyledComponentsRegistry from './lib/AntdRegistry';
const inter = Inter({ subsets: ['latin'] })

// export const metadata: Metadata = {
//   title: 'JK',
//   description: 'Developed By Waleed Akhter',
// }

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  config.autoAddCss = false;
  const session = await getServerSession(nextAuthOptions)
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}
        className={inter.className}>

        <AuthProvider>
          <Header />
          <StyledComponentsRegistry>
            {children}
          </StyledComponentsRegistry>
        </AuthProvider>




      </body>
    </html>
  )
}
