'use client';
import Link from 'next/link'
import { useSearchParams } from 'next/navigation';
import React from 'react'

type Props = {}

const Header = (props: Props) => {
  const searchParams = useSearchParams();
  return (
    <header className='header h-20 gap-8 border-b-2  text-slate-800 flex p-4 items-center shadow-gray-300 shadow-md'>
      <h1 className='text-4xl'>JK</h1>
      <nav className=' flex flex-1 text-xl font-medium gap-8 justify-end '>
        <Link href={"/items"} title='Items' >Items</Link>
        <Link href={"/client"} >Clients</Link>
        <Link href={"/sale"} >Daily Sale </Link>
      </nav>
    </header>
  )
}

export default Header