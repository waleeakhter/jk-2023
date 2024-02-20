'use client';
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { MobileOutlined, UsergroupAddOutlined, ShoppingCartOutlined, FileExclamationOutlined, LogoutOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu, Tag } from 'antd';
import { redirect, usePathname } from 'next/navigation'
import Image from 'next/image';
import Navbar from './Navbar';
type Props = {}

const Header = ({ }: Props) => {

  return (
    <header className='header justify-between h-20 gap-8 border-b-2 sticky top-0 z-50 bg-white  text-slate-800 flex p-4 items-center shadow-gray-300 shadow-md'>
      <Link href={"/dashboard"} className='relative overflow-hidden  flex md:flex-none flex-[0_0_40%]'>
        <div className="w-16 h-12 relative block">
          <Image src={"/logo.svg"} quality={100} fill
            priority alt='logo' />
          <Image src={"/phone.svg"} width="15" height="15" alt='logo' className="m-auto z-10 absolute inset-0" />
        </div>
        <div className='w-28 relative'>
          <Image quality={100}
            fill src="/text.svg" alt='logo' />
        </div>
      </Link>
      <div className=' lg:max-w-md flex w-full'>
        <Navbar />
      </div>
    </header>
  )
}

export default Header

