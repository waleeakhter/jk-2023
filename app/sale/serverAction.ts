'use server'
import { revalidateTag } from "next/cache"
import initialValues from "./form/initialValues"

let apiURL = ""
if (process.env.NODE_ENV === "production") {
    apiURL = process.env.Live_API_URL ?? " "
}

if (process.env.NODE_ENV == "development") {
    process.env.API_URL
}
export const submitSale = async (values: typeof initialValues) => {
    const res = await fetch(apiURL + 'sale', {
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

