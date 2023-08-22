'use client'

import React from "react";
import { disabledBtns } from "./disableBtn";
import { returnItem } from "./serverActions";

export const cancelSaleItem = async (e: React.SyntheticEvent,
    data: Array<{ _id: string }> | { _id: string }) => {


    const btn = (e.target as HTMLButtonElement)
    disabledBtns(btn, true);
    return returnItem(data).then(res => {

        setTimeout(() => {
            disabledBtns(btn, false);
        }, 1000)

        console.log(res)

        return res
    })
}

