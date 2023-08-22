'use server'
import React from 'react'
import AddSale from './AddSale'

type Props = {}

const getItems = async () => {
    const res = await fetch("http://localhost:3000/api/item", {
        cache: "no-cache",
        next: {
            tags: ["item"]
        }
    })
    return res.json();
}

const getClients = async () => {
    const res = await fetch("http://localhost:3000/api/client", {
        cache: "no-cache",
        next: {
            tags: ["clients"]
        }
    })
    return res.json()
}
const SaleForm = async (props: Props) => {
    const itemsData = getItems()
    const clientsData = getClients()
    const [items, clients] = await Promise.all([itemsData, clientsData])
    return (
        <div>
            <AddSale items={items.data} clients={clients} />
        </div>
    )
}

export default SaleForm