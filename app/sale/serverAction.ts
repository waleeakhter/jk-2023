'use server'
import { revalidateTag } from "next/cache"
import initialValues from "./form/initialValues"



export const submitSale = async (values: typeof initialValues) => {
    const res = await fetch(process.env.API_URL + 'sale', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: "no-cache",
        body: JSON.stringify(values),
    })
    const data = await res.json()
    console.log(data)
    if (data?.success) {
        if (values.item.__isNew__) {
            revalidateTag('items')
        }
        if (values.client.__isNew__) {
            revalidateTag('client')
        }
        revalidateTag('sale')
    }
    return data
}

