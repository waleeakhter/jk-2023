"use server"
import fetchCall from "../utils/fetch";

export const getSaleAndProfit = async () => {
    const res = await
        fetch("http://localhost:3000/api/dashboard", {
            method: 'GET',
            cache: "no-cache",
        })
        return res.json()
}