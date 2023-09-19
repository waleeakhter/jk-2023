import { revalidateTag } from "next/cache"

let apiURL = ""
if (process.env.NODE_ENV === "production") {
    apiURL = process.env.Live_API_URL ?? " "
}

if (process.env.NODE_ENV == "development") {
    process.env.API_URL
}
export const onStatusChange = async (data: Object[] | undefined, status: number, paidOn: Date) => {
    const res = await fetch(apiURL + 'sale',
        {
            method: "PATCH",
            body: JSON.stringify({ data: data, status: status, paidOn, statusUpdate: true }),
            cache: 'no-cache',
        }
    )
    revalidateTag("sale")
    const update = await res.json()
    return update
}

export const getClients = async () => {
    const res = await fetch(apiURL + "client", {
        cache: "no-cache",
        next: {
            tags: ["clients"]
        }
    })
    return res.json()
}