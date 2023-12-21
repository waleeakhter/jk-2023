"use server"
import React from 'react'
import { callback } from './submit'
import AdvanceSelect from '@/app/components/AdvanceSelect'

interface Props {
    setFieldValue?: Function
}

const ItemsSelect = async ({ setFieldValue }: Props) => {

    const res = await fetch(process.env.API_URL + "item", {
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
