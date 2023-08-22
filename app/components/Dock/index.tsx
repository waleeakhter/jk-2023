import React from 'react'
import { Dock } from 'primereact/dock';
import { MenuItem } from 'primereact/menuitem';
type Props = {}
const Docker = (props: Props) => {
  const items: MenuItem[] = [
    {
      label: 'Finder',
      icon: () => <img alt="Finder" src="https://primefaces.org/cdn/primereact/images/dock/finder.svg" width="100%" />,
    },
    {
      label: 'App Store',
      icon: () => <img alt="App Store" src="https://primefaces.org/cdn/primereact/images/dock/appstore.svg" width="100%" />,
    },
    {
      label: 'Photos',
      icon: () => <img alt="Photos" src="https://primefaces.org/cdn/primereact/images/dock/photos.svg" width="100%" />,
    },
    {
      label: 'Trash',
      icon: () => <img alt="trash" src="https://primefaces.org/cdn/primereact/images/dock/trash.png" width="100%" />,
    }
  ];
  return (
    <div className='fixed z-[999] max-h-[80vh] h-full bg-white rounded-2xl left-0 mx-auto 
    shadow-lg w-48 p-4'>
      docker
    </div>
  )
}

export default Docker