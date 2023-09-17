'use server'
import React from 'react'
import { Button } from './sale/form/formik';
import Datatable from './components/Datatable/Datatable';
import PrintTable from './print-able';

type Props = {
  searchParams: { type: string }
}

const Home = async ({ searchParams }: Props) => {
  const q = new URLSearchParams(searchParams).toString();
  const getItems = await fetch(process.env.API_URL + 'item?' + q, {
    cache: "no-cache",
    next: {
      tags: ["item"]
    }
  })
  const Items = await getItems.json()

  // const addItems = async (e: React.SyntheticEvent) => {
  //   const formDate = new FormData()
  //   formDate.append("file", e.target?.files[0])
  //   const additems = await fetch('http://localhost:3000/api/item', {
  //     method: "POST",
  //     body: formDate
  //   }).then(res => console.log(res)).catch(err => console.log(err))
  // }
  const columns = [
    { field: 'name', header: 'Item', enabledEdit: true, type: "text" },
    { field: 'type', header: 'Type' },
    { field: 'purchase_price', header: 'Purchase Price', enabledEdit: true, type: "number" },
    { field: 'price', header: 'Price', enabledEdit: true, type: "number" },
    { field: 'stock', header: 'Stock', enabledEdit: true, type: "number" },
  ]

  const CSVheaders = [
    { key: 'name', label: 'Item' },
    { key: 'type', label: 'Type' },
    { key: 'price', label: 'Price' },
    { key: 'stock', label: 'Stock' },
  ]
  return (

    <>
      {/* <Button onClick={addItems} >'Add Items'</Button> */}
      {/* <input type='file' accept='xlsx' onChange={addItems} /> */}
      <Datatable data={Items.data} showSale={Items.totalAmount} hideActionCol={true}
        columns={columns} search={['name', 'type']} hideDeleteBtn={true} tableName={'Items'} addComponent={undefined} targetRoute={'item'} />
    </>
  )
}

export default Home