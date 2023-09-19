"use server"
import React from 'react'
import { callback } from './submit'
import AdvanceSelect from '@/app/components/AdvanceSelect'

interface Props {
    setFieldValue?: Function
}
let apiURL = ""
if (process.env.NODE_ENV === "production") {
    apiURL = process.env.Live_API_URL ?? " "
}

if (process.env.NODE_ENV == "development") {
    process.env.API_URL
}
const ItemsSelect = async ({ setFieldValue }: Props) => {

    const res = await fetch(apiURL + "item", {
        cache: "no-cache",
        next: {
            tags: ["item"]
        }
    })



    const itemsData = await res.json()
    return (
        <AdvanceSelect name={"item"} value={"name"} lableValue={"name"}
            options={[]} extra={"price"} />
    )
}

export default ItemsSelect
