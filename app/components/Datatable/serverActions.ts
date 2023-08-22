'use server'
import { revalidateTag } from 'next/cache';

export const updateOrder = async (data: {
    createdAt: string; _id: string, sell_price: number, sell_quantity: number
}, target: string) => {

    const res = await fetch('http://localhost:3000/api/' + target, {
        method: "PATCH",
        body: JSON.stringify(data),
        cache: 'no-cache',
    })
    console.log(data, "data")
    revalidateTag(target)
    const update = await res.json()
    return update
}



export const returnItem = async (data: {} | Object[]) => {

    const deleteItem = await fetch("http://localhost:3000/api/sale", {
        method: "DELETE",
        cache: "no-cache",
        body: JSON.stringify(data)
    })
    revalidateTag("sale")
    return deleteItem.json()

}