'use client';
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { MobileOutlined, UsergroupAddOutlined, ShoppingCartOutlined, FileExclamationOutlined, LogoutOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu, Tag } from 'antd';
import { redirect, usePathname } from 'next/navigation'
import Image from 'next/image';
import { Session } from 'next-auth/types';
type Props = { session: Session | null }

const Header = ({ session }: Props) => {
  const pathname = usePathname()
  console.log(session)
  const items: MenuProps['items'] = [
    {

      label: (<Link href={"/dashboard/items"} title='Items' >Items</Link>),
      key: 'items',
      icon: <MobileOutlined />,
    },
    {

      label: (<Link href={"/dashboard/client"} >Clients</Link>),
      key: 'client',
      icon: <UsergroupAddOutlined />,
    },
    {

      label: (<Link href={"/dashboard/sale"} >Daily Sale </Link>),
      key: 'sale',
      icon: <ShoppingCartOutlined />,
    },
    {

      label: (<Link className='hover' href={"/dashboard/logs"} >Logs</Link>),
      key: 'logs',
      icon: <FileExclamationOutlined />,
    },
    {

      label: (<Link href={"/api/auth/signout"} >Logout</Link>),
      key: 'logout',
      icon: <LogoutOutlined />,
    },
  ]
  const [current, setCurrent] = useState(pathname.replace("/", ''));

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key);
  };
  return (
    <header className='header justify-between h-20 gap-8 border-b-2 sticky top-0 z-50 bg-white  text-slate-800 flex p-4 items-center shadow-gray-300 shadow-md'>
      <Link href={"/"} className='relative overflow-hidden  flex md:flex-none flex-[0_0_40%]'>
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
      <Menu style={{ minWidth: 0, flex: "auto" }} className=' ml-auto w-full'
          onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
      </div>
    </header>
  )
}

export default Header

