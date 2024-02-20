
import { Item } from "@/types/typings"

export const exportColumns = [
    { header: "Item", dataKey: "item" },
    { header: "Type", dataKey: "type" },
    { header: "Price", dataKey: "price" },
    { header: "Purchase Price", dataKey: "purchase_price" },
    { header: "QTY", dataKey: "stock" },
]



export const exportData = (data: Array<Item>) => {

    return data ? data?.map(el => {
        return {
            item: el.name,
            type: el.type,
            purchase_price: el.purchase_price,
            price: el.price,
            stock: el.stock
        }
    }).sort((a, b) => a.item.localeCompare(b.item)) : []
}
