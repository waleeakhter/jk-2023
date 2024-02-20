import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { MobileOutlined, UsergroupAddOutlined, ShoppingCartOutlined, FileExclamationOutlined, LogoutOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu, Tag } from 'antd';
import { redirect, usePathname } from 'next/navigation'
type Props = {}

const Navbar = (props: Props) => {
    const pathname = usePathname()
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
    <Menu style={{ minWidth: 0, flex: "auto" }} className=' ml-auto w-full'
          onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
  )
}

export default Navbar